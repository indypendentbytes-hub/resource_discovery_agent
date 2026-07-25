import pytest

from resource_discovery_agent.escalation.policy import SafetyEscalationPolicy


@pytest.mark.parametrize(
    "user_request",
    [
        "Make a legal conclusion about lease enforceability",
        "Give tax advice for this term sheet",
        "Make a food safety determination",
        "Write a pesticide prescription",
        "Predict my loan approval",
    ],
)
def test_professional_judgment_escalates(user_request: str) -> None:
    decision = SafetyEscalationPolicy().evaluate(user_request)
    assert decision.required
    assert decision.destination


def test_immediate_danger_is_urgent() -> None:
    decision = SafetyEscalationPolicy().evaluate("I am in immediate danger of self-harm")
    assert decision.required
    assert decision.urgent
