from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime

from resource_discovery_agent.models import ProgressRecord, ProgressState
from resource_discovery_agent.progress.ports import ProgressRepository


@dataclass(slots=True)
class ProgressService:
    repository: ProgressRepository

    def record_evidence(
        self, record: ProgressRecord, evidence: str, *, completes_goal: bool = False
    ) -> ProgressRecord:
        updated = record.model_copy(
            update={
                "evidence": [*record.evidence, evidence],
                "state": ProgressState.COMPLETED if completes_goal else ProgressState.IN_PROGRESS,
                "updated_at": datetime.now(UTC),
            }
        )
        self.repository.save(updated)
        return updated
