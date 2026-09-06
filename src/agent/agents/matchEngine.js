function categoryFit(intake, discoveryPlan, resource) {
  if (intake.categories.includes(resource.category)) return 1;
  if (discoveryPlan.categories.includes(resource.category)) return 0.85;
  return 0.55;
}

export function scoreResource(intake, discoveryPlan, resource) {
  const eligibility = resource.eligibilityEvaluation?.eligibilityScore ?? 0.6;
  const geography = resource.eligibilityEvaluation?.geographicFit ?? 0.65;
  const constraints = resource.eligibilityEvaluation?.constraintFit ?? 0.7;
  const stage = resource.eligibilityEvaluation?.stageFit ?? 0.7;
  const verification = resource.verificationEvaluation?.verificationScore ?? 0.5;
  const category = categoryFit(intake, discoveryPlan, resource);
  const confidence = resource.confidence ?? 0.5;
  const friction = 1 - Math.min(resource.friction ?? 0.3, 0.9);

  const routingScore =
    eligibility * 0.22 +
    geography * 0.16 +
    constraints * 0.16 +
    stage * 0.12 +
    verification * 0.12 +
    category * 0.12 +
    confidence * 0.07 +
    friction * 0.03;

  return {
    ...resource,
    routingScore: Math.max(0, Math.min(1, routingScore)),
    scoreBreakdown: {
      eligibility,
      geography,
      constraints,
      stage,
      verification,
      category,
      confidence,
      friction,
    },
  };
}

export function runMatchEngine(intake, discoveryPlan, resources, limit = 8) {
  return resources
    .filter((resource) => resource.freshness !== "closed")
    .filter((resource) => resource.eligibilityEvaluation?.status !== "not_eligible")
    .map((resource) => scoreResource(intake, discoveryPlan, resource))
    .sort((a, b) =>
      b.routingScore - a.routingScore ||
      (a.friction ?? 0.3) - (b.friction ?? 0.3) ||
      a.title.localeCompare(b.title),
    )
    .slice(0, limit);
}
