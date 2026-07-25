"""Help users choose a measurable direction before matching resources."""

from __future__ import annotations

from dataclasses import dataclass

from resource_discovery_agent.models import (
    GoalOption,
    GoalPlan,
    GoalType,
    UserProfile,
)


@dataclass(frozen=True, slots=True)
class GoalTemplate:
    goal: GoalType
    label: str
    cues: frozenset[str]
    rationale: str
    first_experiment: str
    success_signal: str
    questions: tuple[str, ...]


class GoalSettingService:
    """Produce a small, explainable set of directions from known context."""

    templates = (
        GoalTemplate(
            GoalType.VALIDATE_AN_IDEA,
            "Test whether an idea solves a real problem",
            frozenset({"idea", "unsure", "explore", "problem", "concept"}),
            "Validation reduces the risk of investing in the wrong solution.",
            "Interview five potential users about the problem and current alternatives.",
            "At least three interviews confirm the same important unmet need.",
            (
                "Whose problem are you trying to solve?",
                "What evidence would convince you not to continue?",
            ),
        ),
        GoalTemplate(
            GoalType.START_A_BUSINESS,
            "Turn an idea or skill into an operating business",
            frozenset({"start", "business", "self-employed", "entrepreneur"}),
            "This creates a sequence from concept through legal and operating readiness.",
            "Write a one-page description of the customer, offer, and first transaction.",
            "A specific customer, offer, price hypothesis, and next setup action are defined.",
            (
                "What would you sell and to whom?",
                "How soon do you want the first transaction?",
            ),
        ),
        GoalTemplate(
            GoalType.FIND_FUNDING,
            "Identify the right form of funding",
            frozenset({"funding", "money", "grant", "loan", "capital"}),
            "Funding fit depends on use, amount, timing, readiness, and obligations.",
            "Define the amount, use of funds, deadline, and repayment or equity tolerance.",
            "The funding need is specific enough to screen grants, loans, or investment.",
            (
                "What will the money pay for?",
                "What obligations can you accept?",
            ),
        ),
        GoalTemplate(
            GoalType.IMPROVE_OPERATIONS,
            "Fix the most costly operating bottleneck",
            frozenset({"operations", "overwhelmed", "efficiency", "process", "time"}),
            "A focused bottleneck produces a more useful resource path than general improvement.",
            "Track one recurring process for a week and record time, errors, and delays.",
            "One bottleneck and a baseline measure are identified.",
            (
                "Where are time, money, or customers being lost?",
                "Which process repeats most often?",
            ),
        ),
        GoalTemplate(
            GoalType.MEASURE_ONLINE_VISIBILITY,
            "Establish a baseline for online visibility",
            frozenset({"marketing", "website", "social", "traffic", "visibility"}),
            "A baseline shows which channels deserve attention before buying more tools.",
            "Choose a 30-day period and record traffic, impressions, inquiries, and campaigns.",
            "A channel-level baseline and one improvement target are documented.",
            (
                "Which online channels are active now?",
                "Is the immediate outcome visibility, engagement, or conversion?",
            ),
        ),
    )

    def propose(
        self,
        profile: UserProfile,
        *,
        context: str = "",
        limit: int = 3,
    ) -> GoalPlan:
        if profile.goals:
            return GoalPlan(
                direction_is_clear=True,
                selected_goal=profile.goals[0],
                known_constraints=list(profile.blockers),
                next_step="Confirm the selected goal and define its completion measure.",
            )

        normalized = context.casefold()
        scored = sorted(
            self.templates,
            key=lambda template: (
                -sum(cue in normalized for cue in template.cues),
                template.goal.value,
            ),
        )
        options = [
            GoalOption(
                goal=template.goal,
                label=template.label,
                rationale=template.rationale,
                first_experiment=template.first_experiment,
                success_signal=template.success_signal,
                questions_to_resolve=list(template.questions),
            )
            for template in scored[:limit]
        ]
        return GoalPlan(
            direction_is_clear=False,
            options=options,
            known_constraints=list(profile.blockers),
            next_step=(
                "Choose the direction that feels most useful, revise one option, "
                "or complete its first experiment before selecting resources."
            ),
        )
