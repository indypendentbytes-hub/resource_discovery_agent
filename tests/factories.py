from __future__ import annotations

from datetime import date

from resource_discovery_agent.models import (
    AudienceClassification,
    BusinessStage,
    CostClassification,
    CostModel,
    GoalType,
    InclusionBasis,
    ResourceType,
    SourceRecord,
    SourceStatus,
    UserProfile,
    UserType,
)


def source_record(
    source_id: str = "SRC-999",
    *,
    cost: CostModel = CostModel.FREE,
    resource_types: list[ResourceType] | None = None,
    status: SourceStatus = SourceStatus.ACTIVE,
    live_verification_required: bool = False,
) -> SourceRecord:
    return SourceRecord(
        source_id=source_id,
        official_name=f"Resource {source_id}",
        submitted_url="https://example.org/submitted",
        canonical_url=f"https://example.org/{source_id.casefold()}",
        organization="Example Authority",
        jurisdiction="Indiana",
        service_geographies=["Indiana"],
        authority_class="Official program source",
        source_format="Program page",
        resource_category="Business Support",
        resource_types=resource_types or [ResourceType.TECHNICAL_ASSISTANCE_PROGRAM],
        inclusion_basis=[InclusionBasis.DIRECT_ASSISTANCE],
        audiences=AudienceClassification(
            business_stages=[BusinessStage.STARTUP],
            user_types=[UserType.BUSINESS_OWNER],
            goals=[GoalType.IMPROVE_OPERATIONS],
        ),
        cost=CostClassification(model=cost, verification_required=True),
        capability_tags=["operations"],
        core_user_value="Help a business owner improve operations.",
        status=status,
        last_verified=date(2026, 7, 24),
        refresh_trigger="Verify before recommendation",
        citation_rule="Always cite",
        live_verification_required=live_verification_required,
    )


def user_profile() -> UserProfile:
    return UserProfile(
        user_id="user-1",
        user_type=UserType.BUSINESS_OWNER,
        business_stage=BusinessStage.STARTUP,
        goals=[GoalType.IMPROVE_OPERATIONS],
        location="Indiana",
    )
