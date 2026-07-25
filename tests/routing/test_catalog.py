from pathlib import Path

from resource_discovery_agent.retrieval.catalog import WorkbookCatalog, validate_workbook

CATALOG = (
    Path(__file__).parents[2]
    / "data"
    / "source-catalog"
    / "IB_User_Resource_Agent_Knowledge_Source_Catalog_v3.xlsx"
)


def test_governed_workbook_is_structurally_valid() -> None:
    report = validate_workbook(CATALOG)

    assert report.is_valid, report.errors
    assert report.source_count == 171
    warning_codes = {issue.code for issue in report.warnings}
    assert {
        "guide_catalog_count_mismatch",
        "invalid_canonical_url",
        "unknown_category",
    } <= warning_codes


def test_loader_preserves_every_source() -> None:
    catalog = WorkbookCatalog(CATALOG)

    assert len(catalog.sources) == 172
    assert catalog.get("SRC-001") is not None
    assert catalog.get("SRC-171") is not None
    assert catalog.get("SRC-172") is not None
