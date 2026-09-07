export const AGENTS = {
  discovery: {
    id: "discovery",
    name: "Discovery Agent",
    focus: "Find authoritative candidate resources and programs that match the user's stage, geography, constraints, and stated objective. Prefer primary providers and official sources. Do not decide final eligibility when evidence is incomplete.",
    skillCue: "resource provider agency entity relationship source official verified evidence",
  },
  eligibility: {
    id: "eligibility",
    name: "Eligibility Agent",
    focus: "Evaluate applicability and hard eligibility gates for candidate resources. Separate confirmed, likely, possible, ineligible, and unknown. Extract requirements, exclusions, thresholds, dates, and documentation. Never infer eligibility from marketing copy.",
    skillCue: "eligible qualify applicable requirement deadline documentation grant funding compliance",
  },
  verification: {
    id: "verification",
    name: "Verification Agent",
    focus: "Audit material claims, availability, deadlines, geography, provider identity, freshness, and provenance. Prefer primary sources, preserve contradictions, and explicitly mark unsupported or stale claims.",
    skillCue: "verify evidence source provenance citation conflict contradiction claim fact freshness official",
  },
  gap: {
    id: "gap",
    name: "Constraint and Gap Agent",
    focus: "Diagnose what actually blocks progress. Distinguish missing capacity from underused capacity, coordination, permission, funding, evidence, timing, transportation, skills, or other constraints. Identify the smallest gap that must be solved next.",
    skillCue: "gap barrier constraint missing blocked root cause problem dependency need a",
  },
  pathway: {
    id: "pathway",
    name: "Pathway Agent",
    focus: "Turn verified findings into an ordered path. Identify prerequisites, dependencies, critical-path actions, parallel work, handoffs, decision points, and the concrete next action. Do not introduce new factual claims without evidence from upstream agents.",
    skillCue: "path sequence next step prerequisite dependency critical path handoff scenario compare",
  },
};

const ELIGIBILITY_TERMS = [
  "eligible", "eligibility", "qualify", "apply", "application", "grant", "funding",
  "loan", "award", "program", "requirement", "deadline", "compliance", "permit",
  "certification", "rfp", "nofo",
];

const GAP_TERMS = [
  "blocked", "barrier", "constraint", "missing", "lack", "can't", "cannot", "need",
  "problem", "failure", "not working", "transportation", "equipment", "land", "capital",
  "skills", "capacity",
];

function includesAny(text, terms) {
  return terms.some(term => text.includes(term));
}

export function routeAgents({ query = "", routingSummary = "" } = {}) {
  const text = `${query} ${routingSummary}`.toLowerCase();
  const ids = ["discovery", "verification"];

  if (includesAny(text, ELIGIBILITY_TERMS)) ids.push("eligibility");
  if (includesAny(text, GAP_TERMS)) ids.push("gap");

  return [...new Set(ids)];
}

export function getAgent(id) {
  const agent = AGENTS[id];
  if (!agent) throw new Error(`Unknown RDA agent: ${id}`);
  return agent;
}

export function listAgents() {
  return Object.values(AGENTS).map(({ id, name, focus }) => ({ id, name, focus }));
}
