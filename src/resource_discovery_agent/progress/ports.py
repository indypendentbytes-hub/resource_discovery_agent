from __future__ import annotations

from typing import Protocol

from resource_discovery_agent.models import ProgressRecord


class ProgressRepository(Protocol):
    def save(self, record: ProgressRecord) -> None: ...

    def get(self, record_id: str) -> ProgressRecord | None: ...
