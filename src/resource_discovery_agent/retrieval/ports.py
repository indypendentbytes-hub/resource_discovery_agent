from __future__ import annotations

from typing import Protocol

from resource_discovery_agent.models import GoalType, SourceRecord, UserProfile


class CatalogRepository(Protocol):
    def find_candidates(
        self, *, profile: UserProfile, goal: GoalType, limit: int = 20
    ) -> list[SourceRecord]: ...

    def get(self, source_id: str) -> SourceRecord | None: ...
