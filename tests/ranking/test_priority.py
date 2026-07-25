from pathlib import Path

from resource_discovery_agent.models import CostModel, GoalType, ResourceType
from resource_discovery_agent.ranking.service import RankingService
from resource_discovery_agent.retrieval.catalog import WorkbookCatalog
from tests.factories import source_record, user_profile


def test_free_resource_ranks_above_equivalent_freemium_tool() -> None:
    service = RankingService()
    free = service.score(
        profile=user_profile(),
        goal=GoalType.IMPROVE_OPERATIONS,
        source=source_record("SRC-901", cost=CostModel.FREE),
    )
    freemium = service.score(
        profile=user_profile(),
        goal=GoalType.IMPROVE_OPERATIONS,
        source=source_record(
            "SRC-902",
            cost=CostModel.FREEMIUM,
            resource_types=[ResourceType.COMMERCIAL_TOOL],
        ),
    )

    assert [item.source_id for item in service.rank([freemium, free])] == [
        "SRC-901",
        "SRC-902",
    ]


def test_paid_resource_can_outrank_with_auditable_exception() -> None:
    service = RankingService()
    free = service.score(
        profile=user_profile(),
        goal=GoalType.IMPROVE_OPERATIONS,
        source=source_record("SRC-901", cost=CostModel.FREE),
    )
    paid = service.score(
        profile=user_profile(),
        goal=GoalType.IMPROVE_OPERATIONS,
        source=source_record("SRC-902", cost=CostModel.PAID),
        material_exception="Only option meeting the verified deadline and required capability",
    )

    ranked = service.rank([free, paid])
    assert ranked[0].source_id == "SRC-902"
    assert any("Paid-resource exception" in factor for factor in ranked[0].positive_factors)


def test_businessapp_classification_and_metric_boundaries() -> None:
    catalog_path = (
        Path(__file__).parents[2]
        / "data"
        / "source-catalog"
        / "IB_User_Resource_Agent_Knowledge_Source_Catalog_v3.xlsx"
    )
    businessapp = WorkbookCatalog(catalog_path).get("SRC-172")

    assert businessapp is not None
    assert businessapp.cost.model is CostModel.FREE_BASIC_TIER
    assert businessapp.cost.paid_upgrade_available
    assert ResourceType.FREE_BUSINESS_RESOURCE in businessapp.resource_types
    assert ResourceType.ANALYTICS_TOOL in businessapp.resource_types
    assert ResourceType.COMMERCIAL_FREEMIUM_TOOL in businessapp.resource_types
    assert ResourceType.FUNDING_OPPORTUNITY not in businessapp.resource_types
    assert ResourceType.PUBLIC_DATASET not in businessapp.resource_types
    assert businessapp.metric_boundaries is not None
    assert "Impressions" in businessapp.metric_boundaries.visibility
    assert "Revenue" in businessapp.metric_boundaries.conversion
