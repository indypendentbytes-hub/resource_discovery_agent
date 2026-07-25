from __future__ import annotations

from resource_discovery_agent.models import EscalationDecision


class SafetyEscalationPolicy:
    RULES = (
        (
            {"suicide", "self-harm", "immediate danger"},
            "Emergency services or an appropriate crisis professional",
            "Possible immediate danger requires safety escalation.",
            True,
        ),
        (
            {"legal conclusion", "lease enforceability", "zoning approval"},
            "A qualified attorney or governing authority",
            "The decision requires legal or government judgment.",
            False,
        ),
        (
            {"tax advice", "term sheet", "cap table", "securities"},
            "A qualified tax, accounting, legal, or investment professional",
            "The decision has regulated financial or ownership consequences.",
            False,
        ),
        (
            {"food safety determination", "pesticide prescription", "loan approval"},
            "The appropriate governing agency or qualified professional",
            "The agent cannot make the requested regulated determination.",
            False,
        ),
    )

    def evaluate(self, request: str) -> EscalationDecision:
        normalized = request.casefold()
        for terms, destination, reason, urgent in self.RULES:
            if any(term in normalized for term in terms):
                return EscalationDecision(
                    required=True,
                    destination=destination,
                    reason=reason,
                    urgent=urgent,
                )
        return EscalationDecision(required=False)
