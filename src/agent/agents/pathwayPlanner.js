const ORDER = {
  landHosts: 10,
  training: 20,
  technicalAssistance: 25,
  financing: 30,
  infrastructure: 40,
  sharedUseFacilities: 45,
  regulatorySupport: 50,
  logistics: 60,
  procurement: 70,
  communityPartners: 80,
  growers: 90,
};

function whyNow(category, intake) {
  if (category === "landHosts") return "Secure a viable production site before committing capital or equipment.";
  if (category === "training") return "Build the capability needed to use later resources successfully.";
  if (category === "technicalAssistance") return "Convert the goal and constraints into an executable plan.";
  if (category === "financing") return intake.constraints.capitalAmount !== undefined
    ? "Close the capital gap before taking on higher-cost commitments."
    : "Fund the next viable step without assuming capital is already available.";
  if (category === "infrastructure") return "Acquire or access capacity only after the operating need is clear.";
  if (category === "regulatorySupport") return "Confirm requirements before relying on a site, process, or sales channel.";
  if (category === "logistics") return "Resolve movement constraints before depending on recurring fulfillment.";
  if (category === "procurement") return "Pursue market access after production capacity and requirements are workable.";
  return "This resource addresses a current pathway requirement.";
}

export function runPathwayPlanner(intake, rankedResources) {
  const bestByCategory = new Map();

  for (const resource of rankedResources) {
    if (!bestByCategory.has(resource.category)) bestByCategory.set(resource.category, resource);
  }

  const selected = [...bestByCategory.values()]
    .sort((a, b) => (ORDER[a.category] ?? 999) - (ORDER[b.category] ?? 999))
    .slice(0, 6);

  return selected.map((resource, index) => ({
    step: index + 1,
    resourceId: resource.id,
    title: resource.title,
    category: resource.category,
    whyNow: whyNow(resource.category, intake),
    nextAction: resource.nextAction || "Open the primary source and confirm current eligibility before applying or committing.",
    dependsOn: index === 0 ? [] : [selected[index - 1].id],
    routingScore: resource.routingScore,
  }));
}
