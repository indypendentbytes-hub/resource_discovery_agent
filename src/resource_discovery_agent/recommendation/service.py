from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime

from resource_discovery_agent.escalation.policy import SafetyEscalationPolicy
from resource_discovery_agent.models import (
    CandidateMatch,
    GoalType,
    RecommendationBundle,
    UserProfile,
)
from resource_discovery_agent.ranking.service import RankingService


@dataclass(slots=True)
class RecommendationService:
    ranking: RankingService
    escalation_policy: SafetyEscalationPolicy
    limit: int = 3

    def build(
        self,
        profile: UserProfile,
        goal: GoalType,
        candidates: list[CandidateMatch],
        request_text: str,
    ) -> RecommendationBundle:
        selected = [item for item in candidates if item.eligible_for_recommendation][: self.limit]
        if not selected:
            raise ValueError("No governed candidate passed recommendation gates")
        return RecommendationBundle(
            profile=profile,
            goal=goal,
            recommendations=selected,
            comparison=[
                f"{item.source_id} ranked #{item.rank}: {'; '.join(item.positive_factors)}"
                for item in selected
            ],
            preparation_checklist=[
                "Confirm eligibility, location, timing, and cost.",
                "Gather required identity, business, financial, and prerequisite documents.",
                "Use the official engagement route and record the response.",
            ],
            questions_to_ask=[
                "What is included, what does it cost, and what obligations apply?",
                "What outcome marks successful completion?",
                "What free alternative should I consider first?",
            ],
            completion_kpi="A defined resource outcome is completed and documented.",
            next_step="Engage the highest-ranked verified resource through its official route.",
            citations=[
                citation
                for item in selected
                if item.verification
                for citation in item.verification.citations
            ],
            escalation=self.escalation_policy.evaluate(request_text),
            created_at=datetime.now(UTC),
        )
