function percent(value) {
  return `${Math.round((value || 0) * 100)}%`;
}

function trustLabel(resource) {
  const eligibility = resource.eligibilityEvaluation?.status || "unknown";
  return `eligibility: ${eligibility}; freshness: ${resource.freshness}; confidence: ${percent(resource.confidence)}`;
}

export function runResponseAgent({ intake, rankedResources, pathway, gapReport }) {
  if (intake.escalationRequired) {
    return [
      intake.escalationSummary,
      "I can organize primary sources, facts, and referral options, but the final determination should come from the appropriate qualified advisor or agency.",
    ].join("\n\n");
  }

  if (!rankedResources.length) {
    const gapText = gapReport.gaps.length
      ? gapReport.gaps.map((gap) => `- ${gap.category}: ${gap.description}`).join("\n")
      : "- No viable resource matches were found.";

    return [
      "RESOURCE GAP DETECTED",
      `Goal: ${intake.goal}`,
      `Geography: ${intake.geography || "not yet specified"}`,
      `Stage: ${intake.stage}`,
      "",
      gapText,
      "",
      "Next action: confirm the missing geography or hard constraint, then widen discovery to authoritative regional and national sources.",
    ].join("\n");
  }

  const lines = [
    `Best path for: ${intake.goal}`,
    `Detected stage: ${intake.stage}`,
    "",
  ];

  pathway.forEach((step) => {
    const resource = rankedResources.find((candidate) => candidate.id === step.resourceId);
    if (!resource) return;

    lines.push(
      `${step.step}. ${resource.title} — ${step.whyNow}`,
      `   Match: ${percent(resource.routingScore)}; ${trustLabel(resource)}.`,
      `   Next: ${step.nextAction}`,
      resource.sourceUrl ? `   Source: ${resource.sourceUrl}` : "   Source: primary source still needs confirmation.",
      "",
    );
  });

  const secondary = rankedResources.filter(
    (resource) => !pathway.some((step) => step.resourceId === resource.id),
  ).slice(0, 3);

  if (secondary.length) {
    lines.push("Additional viable matches:");
    secondary.forEach((resource) => {
      lines.push(`- ${resource.title} — match ${percent(resource.routingScore)}; ${trustLabel(resource)}.`);
    });
    lines.push("");
  }

  if (gapReport.hasGap) {
    lines.push("Remaining resource gaps:");
    gapReport.gaps.forEach((gap) => lines.push(`- ${gap.category}: no strong current match.`));
  }

  return lines.join("\n").trim();
}
