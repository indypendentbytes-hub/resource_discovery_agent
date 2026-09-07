import test from "node:test";
import assert from "node:assert/strict";
import { routeAgents, listAgents } from "../lib/agents/registry.js";

test("RDA exposes the five specialist sub-agents", () => {
  const ids = listAgents().map(agent => agent.id).sort();
  assert.deepEqual(ids, ["discovery", "eligibility", "gap", "pathway", "verification"]);
});

test("basic resource discovery always routes discovery and verification", () => {
  const ids = routeAgents({ query: "Find resources for a new urban farm in Indianapolis" });
  assert.ok(ids.includes("discovery"));
  assert.ok(ids.includes("verification"));
});

test("funding questions add eligibility", () => {
  const ids = routeAgents({ query: "Can this farm qualify for the USDA grant?" });
  assert.ok(ids.includes("eligibility"));
});

test("constraint questions add the gap agent", () => {
  const ids = routeAgents({ query: "I am blocked because I need equipment and transportation" });
  assert.ok(ids.includes("gap"));
});
