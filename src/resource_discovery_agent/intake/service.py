from __future__ import annotations

from dataclasses import dataclass

from resource_discovery_agent.models import UserProfile


@dataclass(frozen=True, slots=True)
class IntakeQuestion:
    field: str
    prompt: str
    reason: str


class IntakeService:
    """Ask only for missing facts that can change matching."""

    def missing_context(self, profile: UserProfile) -> list[IntakeQuestion]:
        questions: list[IntakeQuestion] = []
        if not profile.location:
            questions.append(
                IntakeQuestion(
                    "location",
                    "Where are you located or seeking services?",
                    "Service geography and governing authority change fit.",
                )
            )
        if not profile.business_stage:
            questions.append(
                IntakeQuestion(
                    "business_stage",
                    "What stage are you at now?",
                    "Resources serve different readiness and business stages.",
                )
            )
        if not profile.goals:
            questions.append(
                IntakeQuestion(
                    "goal_direction",
                    (
                        "Would you like help comparing a few possible goals based "
                        "on your current situation?"
                    ),
                    (
                        "Goal discovery can turn uncertainty into a small, measurable "
                        "first step before resources are ranked."
                    ),
                )
            )
        return questions
