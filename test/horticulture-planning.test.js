import test from "node:test";
import assert from "node:assert/strict";

import {
  HORTICULTURE_DECISIONS,
  translateDemandToProductionRequirement,
  assessGrowerProductionFit,
  gapsToResourceNeeds,
  runHorticulturePlanning,
} from "../src/agent/horticulturePlanning.js";

const buyerRequirement = {
  skuId: "tomato-slicing",
  quantity: 9600,
  unitId: "lb",
  harvestWeek: "2027-W28",
  specificationIds: ["spec-a"],
};

const cropProfile = {
  skuId: "tomato-slicing",
  productionSystem: "field-grown",
  planningCapacityUnit: "bed_ft",
  outputUnitId: "lb",
  yieldLowPerCapacity: 1.5,
  yieldBasePerCapacity: 2,
  yieldHighPerCapacity: 2.5,
  maturityDaysLow: 65,
  maturityDaysHigh: 80,
  harvestSpan: 35,
  successionInterval: 14,
  riskTier: "medium",
  sourceUrl: "https://example.edu/extension-profile",
  sourceScope: "Central Indiana",
  approvalStatus: "REVIEWED",
};

test("translates buyer demand into a conservative/base/optimistic capacity range", () => {
  const result = translateDemandToProductionRequirement(buyerRequirement, cropProfile);
  assert.equal(result.decision, HORTICULTURE_DECISIONS.FEASIBLE);
  assert.equal(result.planningCapacityUnit, "bed_ft");
  assert.equal(result.capacityRequired.base, 4800);
  assert.equal(result.capacityRequired.low, 3840);
  assert.equal(result.capacityRequired.high, 6400);
});

test("refuses to calculate when yield evidence is missing", () => {
  const result = translateDemandToProductionRequirement(buyerRequirement, {
    ...cropProfile,
    yieldLowPerCapacity: null,
  });
  assert.equal(result.decision, HORTICULTURE_DECISIONS.INSUFFICIENT_EVIDENCE);
});

test("flags an approved-unit-conversion problem for human review", () => {
  const result = translateDemandToProductionRequirement(
    { ...buyerRequirement, unitId: "case" },
    cropProfile,
  );
  assert.equal(result.decision, HORTICULTURE_DECISIONS.HUMAN_REVIEW);
});

test("distinguishes missing grower facts from demonstrated resource gaps", () => {
  const requirement = translateDemandToProductionRequirement(buyerRequirement, cropProfile);
  const fit = assessGrowerProductionFit(requirement, {
    productionSystem: "field-grown",
    requiredCapabilities: ["irrigation"],
    capabilities: { irrigation: false },
  });

  assert.equal(fit.decision, HORTICULTURE_DECISIONS.INSUFFICIENT_EVIDENCE);
  assert.ok(fit.missingFacts.includes("availableCapacity"));
  assert.ok(fit.gaps.some((gap) => gap.type === "irrigation"));
});

test("emits production-capacity and irrigation resource needs", () => {
  const result = runHorticulturePlanning({
    buyerRequirement,
    cropProfile,
    growerCapability: {
      availableCapacity: 3000,
      productionSystem: "field-grown",
      requiredCapabilities: ["irrigation"],
      capabilities: { irrigation: false },
    },
    context: {
      geography: "Johnson County, Indiana",
      growerId: "grower-1",
      plotId: "plot-1",
      opportunityId: "opp-1",
    },
  });

  assert.equal(result.fit.decision, HORTICULTURE_DECISIONS.RESOURCE_GAP);
  assert.equal(result.resourceNeeds.length, 2);
  assert.ok(result.resourceNeeds.some((need) => need.needType === "production_capacity"));
  assert.ok(result.resourceNeeds.some((need) => need.needType === "irrigation"));
});

test("gap translator does not select a provider", () => {
  const needs = gapsToResourceNeeds([
    { type: "production_capacity", gap: 200, capacityUnit: "bed_ft", criticality: "BLOCKING" },
  ], { geography: "Central Indiana" });

  assert.equal(needs.length, 1);
  assert.equal(needs[0].quantity, 200);
  assert.equal(needs[0].providerId, undefined);
});
