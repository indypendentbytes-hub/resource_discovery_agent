"""Free-first, explainable ranking with explicit exception reasons."""

from __future__ import annotations

from dataclasses import dataclass

from resource_discovery_agent.models import (
    CandidateMatch,
    CostModel,
    GoalType,
    SourceRecord,
    UserProfile,
    VerificationResult,
)
from resource_discovery_agent.verification.policy import source_can_be_presented_as_current

COST_PRIORITY = {
    CostModel.FREE: 6.0,
    CostModel.FREE_BASIC_TIER: 5.5,
    CostModel.FREE_WITH_ELIGIBILITY: 5.0,
    CostModel.SUBSIDIZED: 4.0,
    CostModel.FREEMIUM: 2.0,
    CostModel.PAID: 0.0,
    CostModel.SUCCESS_FEE: 0.0,
    CostModel.UNKNOWN: -1.0,
}


@dataclass(slots=True)
class RankingService:
    def score(
        self,
        *,
        profile: UserProfile,
        goal: GoalType,
        source: SourceRecord,
        verification: VerificationResult | None = None,
        material_exception: str | None = None,
    ) -> CandidateMatch:
        score = COST_PRIORITY[source.cost.model]
        factors = [f"Cost priority: {source.cost.model.value}"]
        disqualifiers: list[str] = []

        if profile.user_type in source.audiences.user_types:
            score += 3
            factors.append(f"Serves user type: {profile.user_type.value}")
        if profile.business_stage and profile.business_stage in source.audiences.business_stages:
            score += 2
            factors.append(f"Serves business stage: {profile.business_stage.value}")
        if goal in source.audiences.goals:
            score += 4
            factors.append(f"Directly supports goal: {goal.value}")
        if profile.location and any(
            profile.location.casefold() in geography.casefold()
            or geography.casefold() in profile.location.casefold()
            for geography in source.service_geographies
        ):
            score += 2
            factors.append(f"Serves location: {profile.location}")
        if material_exception:
            score += 7
            factors.append(f"Paid-resource exception: {material_exception}")
        if source_can_be_presented_as_current(source, verification):
            score += 2
            factors.append("Current-status gate passed")
        else:
            disqualifiers.append("Current availability has not passed governance gates.")

        return CandidateMatch(
            source_id=source.source_id,
            rank=1,
            score=score,
            positive_factors=factors,
            constraints=list(source.exclusions),
            disqualifiers=disqualifiers,
            uncertainties=verification.unresolved if verification else [],
            verification=verification,
        )

    def rank(self, candidates: list[CandidateMatch]) -> list[CandidateMatch]:
        ordered = sorted(
            candidates,
            key=lambda candidate: (
                bool(candidate.disqualifiers),
                -candidate.score,
                candidate.source_id,
            ),
        )
        return [
            candidate.model_copy(update={"rank": index})
            for index, candidate in enumerate(ordered, start=1)
        ]
