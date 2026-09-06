export function runGapDetectionAgent(intake, discoveryPlan, rankedResources) {
  const viableCategories = new Set(
    rankedResources
      .filter((resource) => resource.routingScore >= 0.5)
      .map((resource) => resource.category),
  );

  const gaps = discoveryPlan.categories
    .filter((category) => !viableCategories.has(category))
    .map((category) => ({
      type: "resource_capacity_gap",
      category,
      geography: intake.geography,
      stage: intake.stage,
      description: `No sufficiently strong ${category} match was found for the current constraints.`,
    }));

  return {
    hasGap: gaps.length > 0,
    gaps,
    searchedCategories: discoveryPlan.categories.length,
    viableCategories: viableCategories.size,
  };
}
