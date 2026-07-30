const DEFAULT_THRESHOLDS = Object.freeze({
  minimum_total: 3,
  minimum_verified: 2,
  minimum_local: 1,
});

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function includesCategory(entity, category) {
  const target = normalize(category);
  const primary = normalize(entity.knowledge_base_category);
  const tags = Array.isArray(entity.tags) ? entity.tags.map(normalize) : [];
  return primary === target || tags.includes(target);
}

function isVerified(entity) {
  return ["VERIFIED", "PARTIALLY_VERIFIED"].includes(entity.verification_status);
}

function isLocal(entity, geography) {
  if (!geography) return true;
  const target = normalize(geography);
  const locations = Array.isArray(entity.locations) ? entity.locations : [];
  const serviceAreas = Array.isArray(entity.service_areas) ? entity.service_areas : [];
  return [...locations, ...serviceAreas].some((item) =>
    normalize(typeof item === "string" ? item : [item.city, item.county, item.state, item.postal_code].filter(Boolean).join(" ")).includes(target),
  );
}

function priorityFor(status, category) {
  if (status === "MISSING") return "CRITICAL";
  if (status === "SCARCE") return "HIGH";
  if (status === "LOW_VERIFICATION") return "HIGH";
  if (status === "GEOGRAPHIC_GAP") return "MEDIUM";
  return category.priority ?? "NORMAL";
}

export function analyzeResourceCoverage({
  categories,
  entities,
  geography = null,
  thresholds = DEFAULT_THRESHOLDS,
}) {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new TypeError("categories must be a non-empty array");
  }

  const safeEntities = Array.isArray(entities) ? entities : [];
  const mergedThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };

  const results = categories.map((categoryInput) => {
    const category = typeof categoryInput === "string"
      ? { name: categoryInput }
      : categoryInput;
    const matching = safeEntities.filter((entity) => includesCategory(entity, category.name));
    const verified = matching.filter(isVerified);
    const local = matching.filter((entity) => isLocal(entity, geography));

    const requiredTotal = category.minimum_total ?? mergedThresholds.minimum_total;
    const requiredVerified = category.minimum_verified ?? mergedThresholds.minimum_verified;
    const requiredLocal = category.minimum_local ?? mergedThresholds.minimum_local;

    const gap_reasons = [];
    let status = "SUFFICIENT";

    if (matching.length === 0) {
      status = "MISSING";
      gap_reasons.push("No useful entities are assigned to this category.");
    } else if (matching.length < requiredTotal) {
      status = "SCARCE";
      gap_reasons.push(`Only ${matching.length} of ${requiredTotal} required resources are available.`);
    }

    if (matching.length > 0 && verified.length < requiredVerified) {
      if (status === "SUFFICIENT") status = "LOW_VERIFICATION";
      gap_reasons.push(`Only ${verified.length} of ${requiredVerified} required resources are verified.`);
    }

    if (geography && local.length < requiredLocal) {
      if (status === "SUFFICIENT") status = "GEOGRAPHIC_GAP";
      gap_reasons.push(`Only ${local.length} of ${requiredLocal} required resources cover ${geography}.`);
    }

    return {
      category: category.name,
      status,
      priority: priorityFor(status, category),
      counts: {
        total: matching.length,
        verified: verified.length,
        local: local.length,
      },
      thresholds: {
        total: requiredTotal,
        verified: requiredVerified,
        local: requiredLocal,
      },
      gap_reasons,
      entity_ids: matching.map((entity) => entity.entity_id).filter(Boolean),
      recommended_action:
        status === "SUFFICIENT"
          ? "Maintain and periodically reverify coverage."
          : "Run targeted discovery for this category and geography, then verify and deduplicate candidates.",
    };
  });

  const gaps = results.filter((result) => result.status !== "SUFFICIENT");

  return {
    geography,
    generated_at: new Date().toISOString(),
    summary: {
      categories_evaluated: results.length,
      sufficient: results.length - gaps.length,
      gaps: gaps.length,
      missing: gaps.filter((item) => item.status === "MISSING").length,
      scarce: gaps.filter((item) => item.status === "SCARCE").length,
      low_verification: gaps.filter((item) => item.status === "LOW_VERIFICATION").length,
      geographic_gaps: gaps.filter((item) => item.status === "GEOGRAPHIC_GAP").length,
    },
    gaps: gaps.sort((a, b) => {
      const rank = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, NORMAL: 3 };
      return rank[a.priority] - rank[b.priority] || a.category.localeCompare(b.category);
    }),
    categories: results,
  };
}
