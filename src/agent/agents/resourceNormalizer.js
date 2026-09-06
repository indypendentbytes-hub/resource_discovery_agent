function clamp(value, fallback = 0.5) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(1, Math.max(0, number > 1 ? number / 100 : number));
}

function slug(value) {
  return String(value || "resource")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function normalizeFreshness(value) {
  const normalized = String(value || "").toLowerCase();
  if (["verified", "stale", "closed", "uncertain"].includes(normalized)) return normalized;
  if (["open", "active", "current"].includes(normalized)) return "verified";
  return "uncertain";
}

export function normalizeResource(resource, index = 0, checkedAt = new Date().toISOString()) {
  const title = resource.title || resource.name || `Resource ${index + 1}`;
  const sourceUrl = resource.sourceUrl || resource.url || null;
  const eligibilityStatus = resource.eligibilityStatus ||
    (resource.eligibilityConfirmed === true ? "confirmed" :
      resource.eligibilityConfirmed === false ? "unknown" : "unknown");

  return {
    id: resource.id || slug(sourceUrl || title) || `resource-${index + 1}`,
    title,
    name: title,
    provider: resource.provider || null,
    details: resource.details || resource.description || resource.whyFit || "",
    description: resource.description || resource.details || "",
    category: resource.category || "technicalAssistance",
    stages: Array.isArray(resource.stages) ? resource.stages : [],
    geography: resource.geography || null,
    eligibilityStatus,
    eligibilityConfirmed: eligibilityStatus === "confirmed",
    eligibilityNotes: resource.eligibilityNotes || resource.eligibility || null,
    availability: resource.availability || "unknown",
    deadline: resource.deadline || null,
    requirements: Array.isArray(resource.requirements) ? resource.requirements : [],
    benefits: Array.isArray(resource.benefits) ? resource.benefits : [],
    cost: resource.cost ?? null,
    maxAcreage: resource.maxAcreage ?? null,
    confidence: clamp(resource.confidence, 0.5),
    freshness: normalizeFreshness(resource.freshness),
    dateChecked: resource.dateChecked || resource.verificationDate || checkedAt,
    verificationDate: resource.verificationDate || resource.dateChecked || checkedAt,
    sourceUrl,
    url: sourceUrl,
    citation: resource.citation || sourceUrl || null,
    sourceType: resource.sourceType || "unknown",
    friction: clamp(resource.friction, 0.3),
    nextAction: resource.nextAction || resource.next_action || null,
    whyFit: resource.whyFit || null,
  };
}

export function normalizeResources(resources, checkedAt) {
  return (Array.isArray(resources) ? resources : []).map((resource, index) =>
    normalizeResource(resource, index, checkedAt),
  );
}
