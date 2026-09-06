const DEFAULT_CATEGORY_ORDER = [
  "landHosts",
  "training",
  "technicalAssistance",
  "financing",
  "infrastructure",
  "sharedUseFacilities",
  "regulatorySupport",
  "logistics",
  "procurement",
  "communityPartners",
  "growers",
];

const CATEGORY_QUERIES = {
  growers: "grower and producer support",
  landHosts: "land access and land host programs",
  infrastructure: "equipment infrastructure cold storage and production support",
  training: "training classes mentorship and competency development",
  financing: "grants loans microfinance and startup capital",
  technicalAssistance: "business technical assistance advising and planning",
  procurement: "buyers procurement channels and market access",
  logistics: "transportation delivery and logistics support",
  sharedUseFacilities: "shared-use commercial kitchen processing and production space",
  regulatorySupport: "zoning licensing permitting food safety and compliance support",
  communityPartners: "nonprofit community and network partners",
};

function inferNeededCategories(intake) {
  const needs = new Set(intake.categories);

  if (intake.pathwayTags.includes("cultivator")) {
    if (/\b(no land|need land|don't own land|do not own land)\b/i.test(intake.originalMessage)) {
      needs.add("landHosts");
    }
    needs.add("training");
    needs.add("technicalAssistance");
    needs.add("procurement");
  }

  if (intake.constraints.capital || intake.constraints.capitalAmount !== undefined) {
    needs.add("financing");
  }
  if (intake.constraints.equipment) needs.add("infrastructure");
  if (intake.constraints.transportation) needs.add("logistics");
  if (intake.constraints.zoning || intake.constraints.certifications) needs.add("regulatorySupport");

  if (!needs.size) {
    ["technicalAssistance", "training", "financing"].forEach((category) => needs.add(category));
  }

  return DEFAULT_CATEGORY_ORDER.filter((category) => needs.has(category));
}

export function runDiscoveryAgent(intake) {
  const categories = inferNeededCategories(intake);
  const geography = intake.geography || "user geography";

  return {
    categories,
    tasks: categories.map((category, index) => ({
      id: `search-${index + 1}-${category}`,
      category,
      query: `${CATEGORY_QUERIES[category] || category} in ${geography}`,
      priority: index + 1,
      reason: intake.categories.includes(category)
        ? "Directly requested or detected from the user's goal."
        : "Required by a detected constraint or pathway dependency.",
    })),
  };
}

export function mergeDiscoveredResources(...groups) {
  const byKey = new Map();

  for (const group of groups) {
    for (const resource of Array.isArray(group) ? group : []) {
      const name = (resource.name || resource.title || "").trim().toLowerCase();
      const url = (resource.sourceUrl || resource.url || resource.citation || "").trim().toLowerCase();
      const key = url || name;
      if (!key) continue;

      const existing = byKey.get(key);
      byKey.set(key, existing ? { ...existing, ...resource } : resource);
    }
  }

  return [...byKey.values()];
}
