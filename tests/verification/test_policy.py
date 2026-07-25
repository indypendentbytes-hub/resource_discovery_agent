from datetime import UTC, datetime

from resource_discovery_agent.models import (
    SourceStatus,
    VerificationResult,
    VerificationState,
)
from resource_discovery_agent.verification.policy import (
    requires_live_verification,
    source_can_be_presented_as_current,
)
from tests.factories import source_record


def test_cost_and_time_sensitive_fields_require_verification() -> None:
    assert requires_live_verification(source_record(), {"cost"})
    assert requires_live_verification(source_record(), {"eligibility", "deadline"})


def test_quarantined_source_never_becomes_current() -> None:
    source = source_record(status=SourceStatus.QUARANTINED)
    verified = VerificationResult(
        source_id=source.source_id,
        state=VerificationState.VERIFIED,
        checked_at=datetime.now(UTC),
    )
    assert not source_can_be_presented_as_current(source, verified)


def test_verification_required_source_needs_verified_result() -> None:
    source = source_record(
        status=SourceStatus.VERIFICATION_REQUIRED,
        live_verification_required=True,
    )
    verified = VerificationResult(
        source_id=source.source_id,
        state=VerificationState.VERIFIED,
        checked_at=datetime.now(UTC),
    )
    assert not source_can_be_presented_as_current(source, None)
    assert source_can_be_presented_as_current(source, verified)
