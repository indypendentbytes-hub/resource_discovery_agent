from __future__ import annotations

from dataclasses import dataclass

from resource_discovery_agent.intake.goal_setting import GoalSettingService
from resource_discovery_agent.models import (
    GoalPlan,
    GoalType,
    RecommendationBundle,
    UserProfile,
)
from resource_discovery_agent.recommendation.service import RecommendationService
from resource_discovery_agent.retrieval.ports import CatalogRepository
from resource_discovery_agent.verification.ports import LiveVerifier


@dataclass(slots=True)
class ResourceDiscoveryService:
    catalog: CatalogRepository
    verifier: LiveVerifier
    recommendations: RecommendationService
    goal_setting: GoalSettingService

    def set_direction(self, profile: UserProfile, context: str = "") -> GoalPlan:
        """Return the existing goal or a short set of measurable directions."""
        return self.goal_setting.propose(profile, context=context)

    def discover(
        self, profile: UserProfile, goal: GoalType, request_text: str
    ) -> RecommendationBundle:
        matches = []
        for source in self.catalog.find_candidates(profile=profile, goal=goal):
            verification = self.verifier.verify(source)
            matches.append(
                self.recommendations.ranking.score(
                    profile=profile,
                    goal=goal,
                    source=source,
                    verification=verification,
                )
            )
        ranked = self.recommendations.ranking.rank(matches)
        return self.recommendations.build(profile, goal, ranked, request_text)
