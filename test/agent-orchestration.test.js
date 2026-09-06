import test from "node:test";
import assert from "node:assert/strict";
import { orchestrateResourceDiscovery } from "../src/agent/orchestrator.js";

const checkedAt = "2026-09-06T12:00:00.000Z";

test("builds a dependency-aware pathway from land through market access", () => {
  const result = orchestrateResourceDiscovery({
    query: "I want to start growing vegetables in Indianapolis but I don't own land and I only have $800.",
    checkedAt,
    liveCandidates: [
      {
        name: "Land Access Program",
        category: "landHosts",
        geography: "Indianapolis, Indiana",
        eligibilityStatus: "confirmed",
        availability: "open",
        confidence: 0.94,
        freshness: "verified",
        verificationDate: "2026-09-01",
        sourceUrl: "https://example.gov/land",
        sourceType: "primary",
        nextAction: "Review available sites.",
      },
      {
        name: "Farm Startup Training",
        category: "training",
        geography: "Indiana",
        eligibilityStatus: "confirmed",
        availability: "open",
        confidence: 0.9,
        freshness: "verified",
        verificationDate: "2026-09-02",
        sourceUrl: "https://example.edu/training",
        sourceType: "primary",
      },
      {
        name: "Microgrant",
        category: "financing",
        geography: "Indiana",
        eligibilityStatus: "likely",
        availability: "open",
        confidence: 0.82,
        freshness: "verified",
        verificationDate: "2026-09-03",
        sourceUrl: "https://example.gov/grant",
        sourceType: "primary",
      },
      {
        name: "Local Buyer Program",
        category: "procurement",
        geography: "Indianapolis",
        eligibilityStatus: "potential",
        availability: "open",
        confidence: 0.8,
        freshness: "verified",
        verificationDate: "2026-09-01",
        sourceUrl: "https://example.org/buyers",
      },
    ],
  });

  assert.equal(result.intake.constraints.capitalAmount, 800);
  assert.equal(result.pathway[0].category, "landHosts");
  assert.ok(result.pathway.some((step) => step.category === "financing"));
  assert.ok(result.pathway.some((step) => step.category === "procurement"));
  assert.equal(result.state, "verified");
});

test("excludes closed resources and reports resource gaps", () => {
  const result = orchestrateResourceDiscovery({
    query: "I need a shared commercial kitchen in Indianapolis for my startup.",
    checkedAt,
    liveCandidates: [
      {
        name: "Closed Kitchen",
        category: "sharedUseFacilities",
        geography: "Indianapolis",
        eligibilityStatus: "confirmed",
        availability: "closed",
        confidence: 0.95,
        freshness: "closed",
        verificationDate: "2026-09-01",
        sourceUrl: "https://example.org/closed",
      },
    ],
  });

  assert.equal(result.resources.length, 0);
  assert.equal(result.gapReport.hasGap, true);
  assert.match(result.answer, /RESOURCE GAP DETECTED/);
});

test("routes professional determinations to escalation", () => {
  const result = orchestrateResourceDiscovery({
    query: "Tell me whether this zoning determination makes my operation legal.",
    checkedAt,
  });

  assert.equal(result.state, "escalation");
  assert.equal(result.intake.escalationRequired, true);
});
