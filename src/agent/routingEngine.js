const STAGE_RULES = [
  ["Recovery", ["recover", "behind", "crisis", "lost", "decline", "debt"]],
  ["Pivoting", ["pivot", "change direction", "new model", "switch"]],
  ["Stabilizing", ["stabilize", "consistent", "systems", "cash flow"]],
  ["Growth", ["grow", "expand", "scale", "more customers", "hire"]],
  ["Early revenue", ["first sales", "selling", "customers", "revenue"]],
  ["Pre-revenue", ["launch", "before sales", "pre-revenue", "startup"]],
  ["Idea", ["idea", "thinking about", "want to start", "exploring"]],
];

const CONSTRAINT_RULES = {
  acreage: /\b(\d+(?:\.\d+)?)\s*(?:acre|acres)\b/i,
  zoning: /\bzoning|zoned|land use\b/i,
  capital: /\bfunding|capital|loan|grant|money|budget\b/i,
  equipment: /\bequipment|tools|tractor|irrigation\b/i,
  labor: /\blabor|staff|workers|employees|help\b/i,
  timeline: /\btoday|week|month|season|deadline|soon|urgent\b/i,
  certifications: /\bcertif|organic|licensed|permit|food safety\b/i,
  transportation: /\btransport|delivery|vehicle|truck|ride|logistics\b/i,
  riskTolerance: /\brisk|safe|conservative|aggressive\b/i,
};

const CATEGORY_KEYWORDS = {
  growers: ["grower", "farm", "produce", "crop"],
  landHosts: ["land", "lot", "acre", "space"],
  infrastructure: ["infrastructure", "equipment", "cold storage", "irrigation"],
  training: ["training", "learn", "course", "class"],
  financing: ["funding", "capital", "loan", "grant"],
  technicalAssistance: ["technical assistance", "advisor", "mentor", "planning"],
  procurement: ["buyer", "procurement", "market", "sell"],
  logistics: ["delivery", "transport", "logistics", "truck"],
  sharedUseFacilities: ["shared kitchen", "facility", "processing", "commercial kitchen"],
  regulatorySupport: ["legal", "tax", "permit", "zoning", "compliance", "license"],
  communityPartners: ["community", "partner", "nonprofit", "network"],
};

const ESCALATION_PATTERN = /\blegal|tax|compliance|loan terms|securities|contract|zoning determination\b/i;

export function detectStage(message) {
  const normalized = message.toLowerCase();
  for (const [stage, keywords] of STAGE_RULES) {
    if (keywords.some((keyword) => normalized.includes(keyword))) return stage;
  }
  return "Uncertain";
}

export function extractConstraints(message) {
  const constraints = {};
  for (const [name, pattern] of Object.entries(CONSTRAINT_RULES)) {
    const match = message.match(pattern);
    if (match) constraints[name] = match[1] ?? true;
  }

  const geography = message.match(/\b(?:near|in|around)\s+([A-Za-z][A-Za-z .'-]{2,40})/i);
  if (geography) constraints.geography = geography[1].trim();

  return constraints;
}

function requestedCategories(message) {
  const normalized = message.toLowerCase();
  return Object.entries(CATEGORY_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))
    .map(([category]) => category);
}

function scoreResource(resource, stage, constraints, categories) {
  const stageFit = resource.stages?.includes(stage) ? 1 : stage === "Uncertain" ? 0.65 : 0.45;
  const categoryFit = categories.length === 0 || categories.includes(resource.category) ? 1 : 0.5;

  let constraintFit = 1;
  if (constraints.geography && resource.geography) {
    constraintFit *= resource.geography.toLowerCase().includes(constraints.geography.toLowerCase()) ? 1 : 0.55;
  }
  if (constraints.acreage && resource.maxAcreage) {
    constraintFit *= Number(constraints.acreage) <= resource.maxAcreage ? 1 : 0.2;
  }

  const eligibility = resource.eligibilityConfirmed ? 1 : 0.65;
  const confidence = resource.confidence ?? 0.5;
  const freshness = resource.freshness === "verified" ? 1 : resource.freshness === "stale" ? 0.65 : resource.freshness === "closed" ? 0 : 0.5;
  const friction = 1 - Math.min(resource.friction ?? 0.3, 0.9) * 0.25;

  return stageFit * categoryFit * constraintFit * eligibility * confidence * freshness * friction;
}

export function routeResources(message, resources) {
  const stage = detectStage(message);
  const constraints = extractConstraints(message);
  const categories = requestedCategories(message);

  if (ESCALATION_PATTERN.test(message)) {
    return {
      state: "escalation",
      stage,
      constraints,
      categories: categories.length ? categories : ["regulatorySupport"],
      question: null,
      recommendations: [],
      summary: "This question needs a qualified legal, tax, financing, or compliance advisor. The agent can organize relevant facts and referral options but should not make the determination."
    };
  }

  if (stage === "Uncertain" && categories.length === 0 && Object.keys(constraints).length === 0) {
    return {
      state: "uncertain",
      stage,
      constraints,
      categories: [],
      question: "What are you trying to accomplish first: start a business, find land, secure funding, complete training, or reach buyers?",
      recommendations: [],
      summary: "I need one business-stage signal before ranking resources."
    };
  }

  const recommendations = resources
    .map((resource) => ({ ...resource, routingScore: scoreResource(resource, stage, constraints, categories) }))
    .filter((resource) => resource.routingScore > 0)
    .sort((a, b) => b.routingScore - a.routingScore || (a.friction ?? 0) - (b.friction ?? 0))
    .slice(0, 5);

  const state = recommendations.length === 0
    ? "empty"
    : recommendations.every((resource) => resource.freshness === "verified")
      ? "verified"
      : recommendations.some((resource) => resource.freshness === "stale")
        ? "stale"
        : "uncertain";

  return {
    state,
    stage,
    constraints,
    categories,
    question: recommendations.length === 0 ? "Which location and business stage should I use to widen the search?" : null,
    recommendations,
    summary: recommendations.length
      ? `Detected stage: ${stage}. Ranked ${recommendations.length} resource match${recommendations.length === 1 ? "" : "es"} using fit, eligibility, confidence, freshness, friction, and geography.`
      : "No eligible matches were found from the current sample resource graph."
  };
}
