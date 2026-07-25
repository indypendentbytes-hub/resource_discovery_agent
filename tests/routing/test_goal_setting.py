from resource_discovery_agent.intake.goal_setting import GoalSettingService
from resource_discovery_agent.models import GoalType, UserProfile, UserType


def test_uncertain_user_receives_measurable_goal_options() -> None:
    profile = UserProfile(
        user_type=UserType.ASPIRING_ENTREPRENEUR,
        blockers=["Limited budget"],
    )

    plan = GoalSettingService().propose(
        profile,
        context="I have an idea but I am unsure what direction to take",
    )

    assert not plan.direction_is_clear
    assert 1 <= len(plan.options) <= 3
    assert plan.options[0].goal is GoalType.VALIDATE_AN_IDEA
    assert all(option.first_experiment for option in plan.options)
    assert all(option.success_signal for option in plan.options)
    assert plan.known_constraints == ["Limited budget"]


def test_existing_goal_is_confirmed_without_replacing_it() -> None:
    profile = UserProfile(
        user_type=UserType.BUSINESS_OWNER,
        goals=[GoalType.FIND_FUNDING],
    )

    plan = GoalSettingService().propose(profile)

    assert plan.direction_is_clear
    assert plan.selected_goal is GoalType.FIND_FUNDING
    assert plan.options == []


def test_context_prioritizes_relevant_direction() -> None:
    profile = UserProfile(user_type=UserType.SMALL_BUSINESS)

    plan = GoalSettingService().propose(
        profile,
        context="I need to understand website traffic and marketing visibility",
    )

    assert plan.options[0].goal is GoalType.MEASURE_ONLINE_VISIBILITY
