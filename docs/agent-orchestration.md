# Resource Discovery Agent orchestration

The runtime is intentionally split into specialized agents instead of relying on one model call to make every decision.

## Pipeline

1. **Intake Agent** — detects stage, goal, geography, pathway tags, hard constraints, and escalation conditions.
2. **Discovery Agent** — decomposes the user's goal into category-specific searches.
3. **Resource Normalizer** — converts catalog and live-search results into one contract.
4. **Eligibility Agent** — evaluates explicit eligibility, geography, stage, and hard-constraint fit without inventing missing facts.
5. **Verification Agent** — scores source trust, freshness, availability, and recheck needs.
6. **Match Engine** — ranks viable resources with an auditable weighted score.
7. **Pathway Planner** — sequences the strongest matches according to dependencies rather than returning a flat link list.
8. **Gap Detection Agent** — records categories where no strong resource exists.
9. **Response Agent** — turns the structured result into a concise explanation and next actions.
10. **Orchestrator** — runs the modules in order and returns the complete structured result.

## Design rule

The model is used for live discovery and interpretation. Deterministic code owns eligibility state, verification state, ranking, sequencing, gap detection, and output contracts.

## Safety

- Explicitly closed resources are excluded from ranking.
- Explicitly ineligible resources are excluded.
- Unknown eligibility remains unknown.
- Missing source URLs reduce verification confidence.
- Legal, tax, financing, zoning, contract, securities, and compliance determinations trigger escalation rather than a definitive professional conclusion.
