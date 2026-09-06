import { runIntakeAgent } from "./agents/intakeAgent.js";
import { runDiscoveryAgent, mergeDiscoveredResources } from "./agents/discoveryAgent.js";
import { normalizeResources } from "./agents/resourceNormalizer.js";
import { runEligibilityAgent } from "./agents/eligibilityAgent.js";
import { runVerificationAgent } from "./agents/verificationAgent.js";
import { runMatchEngine } from "./agents/matchEngine.js";
import { runPathwayPlanner } from "./agents/pathwayPlanner.js";
import { runGapDetectionAgent } from "./agents/gapDetectionAgent.js";
import { runResponseAgent } from "./agents/responseAgent.js";

export function orchestrateResourceDiscovery({
  query,
  catalogCandidates = [],
  liveCandidates = [],
  checkedAt = new Date().toISOString(),
}) {
  const intake = runIntakeAgent(query);
  const discoveryPlan = runDiscoveryAgent(intake);

  if (intake.escalationRequired) {
    const gapReport = {
      hasGap: false,
      gaps: [],
      searchedCategories: 0,
      viableCategories: 0,
    };

    return {
      state: "escalation",
      intake,
      discoveryPlan,
      resources: [],
      pathway: [],
      gapReport,
      answer: runResponseAgent({
        intake,
        rankedResources: [],
        pathway: [],
        gapReport,
      }),
    };
  }

  const merged = mergeDiscoveredResources(catalogCandidates, liveCandidates);
  const normalized = normalizeResources(merged, checkedAt);
  const evaluated = normalized
    .map((resource) => runEligibilityAgent(intake, resource))
    .map((resource) => runVerificationAgent(resource, checkedAt));

  const resources = runMatchEngine(intake, discoveryPlan, evaluated);
  const pathway = runPathwayPlanner(intake, resources);
  const gapReport = runGapDetectionAgent(intake, discoveryPlan, resources);

  const state = resources.length === 0
    ? "empty"
    : resources.every((resource) => resource.freshness === "verified")
      ? "verified"
      : resources.some((resource) => resource.freshness === "stale")
        ? "stale"
        : "uncertain";

  return {
    state,
    intake,
    discoveryPlan,
    resources,
    pathway,
    gapReport,
    answer: runResponseAgent({
      intake,
      rankedResources: resources,
      pathway,
      gapReport,
    }),
  };
}
