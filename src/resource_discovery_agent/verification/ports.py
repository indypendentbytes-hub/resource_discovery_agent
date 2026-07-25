from __future__ import annotations

from typing import Protocol

from resource_discovery_agent.models import SourceRecord, VerificationResult


class LiveVerifier(Protocol):
    def verify(self, source: SourceRecord) -> VerificationResult: ...
