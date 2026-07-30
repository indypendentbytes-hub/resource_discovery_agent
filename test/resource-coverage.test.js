import test from "node:test";
import assert from "node:assert/strict";
import { analyzeResourceCoverage } from "../src/coverage/analyze-resource-coverage.js";

test("surfaces missing and scarce resource categories", () => {
  const report = analyzeResourceCoverage({
    geography: "Indianapolis",
    categories: [
      { name: "emergency funding", minimum_total: 2, minimum_verified: 1 },
      { name: "food access", minimum_total: 2, minimum_verified: 1 },
      { name: "business funding", minimum_total: 1, minimum_verified: 1 },
    ],
    entities: [
      {
        entity_id: "food-1",
        knowledge_base_category: "food access",
        tags: ["emergency assistance"],
        verification_status: "VERIFIED",
        service_areas: ["Indianapolis"],
      },
      {
        entity_id: "business-1",
        knowledge_base_category: "business funding",
        tags: [],
        verification_status: "VERIFIED",
        locations: [{ city: "Indianapolis", state: "IN" }],
      },
    ],
  });

  assert.equal(report.summary.missing, 1);
  assert.equal(report.summary.scarce, 1);
  assert.equal(report.gaps[0].category, "emergency funding");
  assert.equal(report.gaps[0].status, "MISSING");

  const foodGap = report.gaps.find((item) => item.category === "food access");
  assert.equal(foodGap.status, "SCARCE");

  const business = report.categories.find((item) => item.category === "business funding");
  assert.equal(business.status, "SUFFICIENT");
});

test("surfaces verification and geographic gaps separately", () => {
  const report = analyzeResourceCoverage({
    geography: "Indianapolis",
    categories: [
      { name: "legal assistance", minimum_total: 1, minimum_verified: 1, minimum_local: 1 },
    ],
    entities: [
      {
        entity_id: "legal-1",
        knowledge_base_category: "legal assistance",
        verification_status: "UNVERIFIED",
        service_areas: ["Fort Wayne"],
      },
    ],
  });

  const gap = report.gaps[0];
  assert.equal(gap.status, "LOW_VERIFICATION");
  assert.equal(gap.counts.local, 0);
  assert.equal(gap.gap_reasons.length, 2);
});
