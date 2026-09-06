function geographyScore(userGeography, resourceGeography) {
  if (!userGeography || !resourceGeography) return 0.65;
  const user = userGeography.toLowerCase();
  const resource = resourceGeography.toLowerCase();

  if (resource.includes("national") || resource.includes("united states") || resource.includes("u.s.")) return 0.9;
  if (resource.includes(user) || user.includes(resource)) return 1;

  const userState = user.match(/\b(indiana|in)\b/);
  const resourceState = resource.match(/\b(indiana|in)\b/);
  if (userState && resourceState) return 0.85;

  return 0.45;
}

function stageScore(stage, stages) {
  if (!stage || stage === "Uncertain" || !stages?.length) return 0.7;
  return stages.includes(stage) ? 1 : 0.5;
}

function constraintScore(intake, resource) {
  let score = 1;

  if (intake.constraints.acreage && resource.maxAcreage) {
    score *= Number(intake.constraints.acreage) <= Number(resource.maxAcreage) ? 1 : 0.25;
  }

  if (intake.constraints.capitalAmount !== undefined && resource.cost !== null) {
    const cost = Number(resource.cost);
    if (Number.isFinite(cost) && cost > intake.constraints.capitalAmount) score *= 0.6;
  }

  return score;
}

export function runEligibilityAgent(intake, resource) {
  const status = String(resource.eligibilityStatus || "unknown").toLowerCase();
  const explicitIneligible = ["not_eligible", "ineligible", "not eligible"].includes(status);

  const eligibilityScore = explicitIneligible
    ? 0
    : status === "confirmed"
      ? 1
      : status === "likely"
        ? 0.82
        : status === "potential"
          ? 0.7
          : 0.6;

  const geoFit = geographyScore(intake.geography, resource.geography);
  const stageFit = stageScore(intake.stage, resource.stages);
  const constraintsFit = constraintScore(intake, resource);

  return {
    ...resource,
    eligibilityEvaluation: {
      status: explicitIneligible ? "not_eligible" : status,
      eligibilityScore,
      geographicFit: geoFit,
      stageFit,
      constraintFit: constraintsFit,
      requiresConfirmation: status !== "confirmed",
    },
  };
}
