from __future__ import annotations

from resource_discovery_agent.models import (
    CostModel,
    SourceRecord,
    SourceStatus,
    VerificationResult,
    VerificationState,
)

TIME_SENSITIVE_FIELDS = frozenset(
    {
        "application status",
        "capacity",
        "contacts",
        "cost",
        "deadline",
        "eligibility",
        "funding availability",
        "program status",
        "program terms",
        "recall",
        "registration",
        "service area",
    }
)


def requires_live_verification(source: SourceRecord, claims: set[str]) -> bool:
    normalized = {claim.casefold() for claim in claims}
    return (
        source.live_verification_required
        or source.cost.verification_required
        or source.cost.model is CostModel.UNKNOWN
        or bool(normalized & TIME_SENSITIVE_FIELDS)
    )


def source_can_be_presented_as_current(
    source: SourceRecord, verification: VerificationResult | None
) -> bool:
    if source.status in {
        SourceStatus.CLOSED,
        SourceStatus.ARCHIVED,
        SourceStatus.QUARANTINED,
        SourceStatus.UNVERIFIED,
    }:
        return False
    if source.status is SourceStatus.VERIFICATION_REQUIRED or source.live_verification_required:
        return verification is not None and verification.state is VerificationState.VERIFIED
    return True
