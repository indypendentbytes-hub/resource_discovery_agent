from pathlib import Path

import pytest
from pydantic import ValidationError

from resource_discovery_agent.models import EscalationDecision
from resource_discovery_agent.tools.export_schemas import rendered_schemas
from tests.factories import source_record

SCHEMAS = Path(__file__).parents[2] / "schemas"


def test_source_round_trip() -> None:
    source = source_record()
    assert type(source).model_validate_json(source.model_dump_json()) == source


def test_required_escalation_needs_details() -> None:
    with pytest.raises(ValidationError):
        EscalationDecision(required=True)


def test_checked_in_schemas_have_no_drift() -> None:
    for filename, expected in rendered_schemas().items():
        assert (SCHEMAS / filename).read_text(encoding="utf-8") == expected
