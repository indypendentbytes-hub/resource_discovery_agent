function ageInDays(date, now) {
  const checked = new Date(date);
  const current = new Date(now);
  if (Number.isNaN(checked.getTime()) || Number.isNaN(current.getTime())) return null;
  return Math.max(0, (current.getTime() - checked.getTime()) / 86_400_000);
}

function sourceTrust(resource) {
  if (!resource.sourceUrl) return 0.45;
  try {
    const host = new URL(resource.sourceUrl).hostname.toLowerCase();
    if (host.endsWith(".gov")) return 1;
    if (host.endsWith(".edu")) return 0.95;
    if (resource.sourceType === "primary") return 0.95;
    return 0.8;
  } catch {
    return 0.5;
  }
}

export function runVerificationAgent(resource, checkedAt = new Date().toISOString()) {
  const availability = String(resource.availability || "").toLowerCase();
  const explicitlyClosed =
    resource.freshness === "closed" ||
    ["closed", "ended", "expired", "unavailable"].some((value) => availability.includes(value));

  const age = ageInDays(resource.dateChecked, checkedAt);
  let freshness = resource.freshness;

  if (explicitlyClosed) {
    freshness = "closed";
  } else if (freshness !== "verified") {
    if (age !== null && age <= 45 && resource.sourceUrl) freshness = "verified";
    else if (age !== null && age > 120) freshness = "stale";
    else freshness = "uncertain";
  }

  const freshnessScore =
    freshness === "verified" ? 1 :
      freshness === "uncertain" ? 0.65 :
        freshness === "stale" ? 0.4 : 0;

  const trust = sourceTrust(resource);
  const verificationScore = Math.min(1, (freshnessScore * 0.6) + (trust * 0.4));

  return {
    ...resource,
    freshness,
    verificationEvaluation: {
      checkedAt: resource.dateChecked || checkedAt,
      sourceTrust: trust,
      freshnessScore,
      verificationScore,
      hasPrimarySource: Boolean(resource.sourceUrl),
      requiresRecheck: freshness !== "verified",
    },
  };
}
