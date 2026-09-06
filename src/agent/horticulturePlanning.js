// Horticulture planning capability for RDA.
//
// Purpose: translate a known buyer/product requirement into production-capacity
// requirements, compare those requirements with a grower's known capability,
// and emit resource gaps that RDA can route. This module does NOT invent crop
// science values. Yield, maturity, spacing, succession, and risk assumptions
// must come from cited/approved CropPlanningProfile-style evidence.

export const HORTICULTURE_SOURCE_TIERS = Object.freeze({
  PRIMARY: "PRIMARY", // Extension, USDA, land-grant university, official trial/publication
  REVIEWED: "REVIEWED", // Qualified horticulture expert-reviewed local profile
  SECONDARY: "SECONDARY", // Reputable technical source not yet locally validated
  SELF_REPORTED: "SELF_REPORTED", // Grower observation/experience
  UNKNOWN: "UNKNOWN",
});

export const HORTICULTURE_DECISIONS = Object.freeze({
  FEASIBLE: "FEASIBLE",
  FEASIBLE_WITH_RISK: "FEASIBLE_WITH_RISK",
  RESOURCE_GAP: "RESOURCE_GAP",
  INSUFFICIENT_EVIDENCE: "INSUFFICIENT_EVIDENCE",
  HUMAN_REVIEW: "HUMAN_REVIEW",
});

function finitePositive(value) {
  return Number.isFinite(Number(value)) && Number(value) > 0;
}

function normalizeRange(low, base, high) {
  const values = [low, base, high].map(Number);
  if (!values.every(Number.isFinite) || values.some((value) => value <= 0)) return null;
  if (!(values[0] <= values[1] && values[1] <= values[2])) return null;
  return { low: values[0], base: values[1], high: values[2] };
}

/**
 * Convert buyer demand into required production capacity using an approved
 * crop-planning profile. The result is a range because agricultural yield is
 * uncertain. Higher yield means less capacity is required.
 *
 * buyerRequirement:
 *   { skuId, quantity, unitId, harvestWeek, specificationIds? }
 * cropProfile:
 *   { skuId, planningCapacityUnit, outputUnitId,
 *     yieldLowPerCapacity, yieldBasePerCapacity, yieldHighPerCapacity,
 *     maturityDaysLow?, maturityDaysHigh?, harvestSpan?, successionInterval?,
 *     productionSystem?, riskTier?, sourceUrl?, sourceScope?, approvalStatus? }
 */
export function translateDemandToProductionRequirement(buyerRequirement, cropProfile) {
  if (!buyerRequirement || !cropProfile) {
    return { decision: HORTICULTURE_DECISIONS.INSUFFICIENT_EVIDENCE, reasons: ["Missing buyer requirement or crop profile."] };
  }

  if (!finitePositive(buyerRequirement.quantity)) {
    return { decision: HORTICULTURE_DECISIONS.INSUFFICIENT_EVIDENCE, reasons: ["Buyer quantity must be a positive number."] };
  }

  if (buyerRequirement.skuId && cropProfile.skuId && buyerRequirement.skuId !== cropProfile.skuId) {
    return { decision: HORTICULTURE_DECISIONS.HUMAN_REVIEW, reasons: ["Buyer SKU does not match the crop planning profile SKU."] };
  }

  if (buyerRequirement.unitId && cropProfile.outputUnitId && buyerRequirement.unitId !== cropProfile.outputUnitId) {
    return { decision: HORTICULTURE_DECISIONS.HUMAN_REVIEW, reasons: ["Buyer demand unit and crop output unit require an approved conversion."] };
  }

  const yieldRange = normalizeRange(
    cropProfile.yieldLowPerCapacity,
    cropProfile.yieldBasePerCapacity,
    cropProfile.yieldHighPerCapacity,
  );

  if (!yieldRange || !cropProfile.planningCapacityUnit) {
    return {
      decision: HORTICULTURE_DECISIONS.INSUFFICIENT_EVIDENCE,
      reasons: ["Approved yield range and planning capacity unit are required before capacity can be calculated."],
    };
  }

  const quantity = Number(buyerRequirement.quantity);
  const capacityRequired = {
    // Conservative requirement assumes low yield; optimistic assumes high yield.
    low: quantity / yieldRange.high,
    base: quantity / yieldRange.base,
    high: quantity / yieldRange.low,
  };

  return {
    decision: HORTICULTURE_DECISIONS.FEASIBLE,
    skuId: buyerRequirement.skuId ?? cropProfile.skuId,
    outputUnitId: cropProfile.outputUnitId ?? buyerRequirement.unitId,
    quantityRequired: quantity,
    harvestWeek: buyerRequirement.harvestWeek ?? null,
    specificationIds: buyerRequirement.specificationIds ?? [],
    productionSystem: cropProfile.productionSystem ?? null,
    planningCapacityUnit: cropProfile.planningCapacityUnit,
    capacityRequired,
    yieldRange,
    timing: {
      maturityDaysLow: cropProfile.maturityDaysLow ?? null,
      maturityDaysHigh: cropProfile.maturityDaysHigh ?? null,
      harvestSpan: cropProfile.harvestSpan ?? null,
      successionInterval: cropProfile.successionInterval ?? null,
    },
    riskTier: cropProfile.riskTier ?? null,
    evidence: {
      sourceUrl: cropProfile.sourceUrl ?? null,
      sourceScope: cropProfile.sourceScope ?? null,
      approvalStatus: cropProfile.approvalStatus ?? "UNREVIEWED",
    },
  };
}

/**
 * Compare a production requirement with known grower/plot capability.
 * No value is assumed from absence. Missing facts are returned separately so
 * RDA can ask only for information that is actually required.
 */
export function assessGrowerProductionFit(requirement, capability = {}) {
  if (!requirement?.capacityRequired?.base || !requirement.planningCapacityUnit) {
    return { decision: HORTICULTURE_DECISIONS.INSUFFICIENT_EVIDENCE, gaps: [], missingFacts: ["productionRequirement"] };
  }

  const gaps = [];
  const missingFacts = [];
  const availableCapacity = Number(capability.availableCapacity);

  if (!Number.isFinite(availableCapacity)) {
    missingFacts.push("availableCapacity");
  } else if (availableCapacity < requirement.capacityRequired.base) {
    gaps.push({
      type: "production_capacity",
      capacityUnit: requirement.planningCapacityUnit,
      requiredBase: requirement.capacityRequired.base,
      available: availableCapacity,
      gap: requirement.capacityRequired.base - availableCapacity,
      criticality: "BLOCKING",
    });
  }

  if (requirement.productionSystem) {
    if (!capability.productionSystem) missingFacts.push("productionSystem");
    else if (capability.productionSystem !== requirement.productionSystem) {
      gaps.push({
        type: "production_system",
        required: requirement.productionSystem,
        available: capability.productionSystem,
        criticality: "REVIEW",
      });
    }
  }

  for (const capabilityName of capability.requiredCapabilities ?? []) {
    const known = capability.capabilities?.[capabilityName];
    if (known === undefined || known === null) missingFacts.push(`capabilities.${capabilityName}`);
    else if (known === false) gaps.push({ type: capabilityName, required: true, available: false, criticality: "BLOCKING" });
  }

  if (missingFacts.length) {
    return { decision: HORTICULTURE_DECISIONS.INSUFFICIENT_EVIDENCE, gaps, missingFacts };
  }

  return {
    decision: gaps.some((gap) => gap.criticality === "BLOCKING")
      ? HORTICULTURE_DECISIONS.RESOURCE_GAP
      : gaps.length
        ? HORTICULTURE_DECISIONS.FEASIBLE_WITH_RISK
        : HORTICULTURE_DECISIONS.FEASIBLE,
    gaps,
    missingFacts: [],
  };
}

/**
 * Turn horticultural feasibility gaps into the neutral resource-need shape RDA
 * can use for discovery/routing. It deliberately does not select an provider.
 */
export function gapsToResourceNeeds(gaps = [], context = {}) {
  return gaps
    .filter((gap) => gap.criticality === "BLOCKING" || gap.criticality === "REVIEW")
    .map((gap) => ({
      needType: gap.type,
      quantity: gap.gap ?? null,
      unit: gap.capacityUnit ?? null,
      geography: context.geography ?? null,
      neededBy: context.neededBy ?? null,
      duration: context.duration ?? null,
      growerId: context.growerId ?? null,
      plotId: context.plotId ?? null,
      opportunityId: context.opportunityId ?? null,
      skuId: context.skuId ?? null,
      criticality: gap.criticality,
      source: "HORTICULTURE_PLANNING",
    }));
}

/**
 * End-to-end specialist orchestration. RDA can call this capability after it
 * receives a real buyer requirement and known grower capability data.
 */
export function runHorticulturePlanning({ buyerRequirement, cropProfile, growerCapability, context = {} }) {
  const requirement = translateDemandToProductionRequirement(buyerRequirement, cropProfile);
  if (requirement.decision !== HORTICULTURE_DECISIONS.FEASIBLE) {
    return { requirement, fit: null, resourceNeeds: [] };
  }

  const fit = assessGrowerProductionFit(requirement, growerCapability);
  const resourceNeeds = gapsToResourceNeeds(fit.gaps, {
    ...context,
    skuId: requirement.skuId,
  });

  return { requirement, fit, resourceNeeds };
}
