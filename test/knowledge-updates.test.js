import test from "node:test";
import assert from "node:assert/strict";
import { processKnowledgeUpdate } from "../src/knowledge-updates/process.js";

function makeUpdate(overrides = {}) {
  return {
    update_id: "upd-001",
    source_id: "source-001",
    change_type: "UPDATED",
    status: "EXTRACTED",
    source_url: "https://example.gov/program",
    source_organization: "Example Agency",
    authority_class: "OFFICIAL_GOVERNMENT_PROGRAM",
    retrieved_at: "2026-07-30T12:00:00Z",
    evidence: [
      {
        claim: "The canonical URL changed.",
        supporting_text: "Program information is now maintained at this URL.",
        source_url: "https://example.gov/program",
      },
    ],
    proposed_changes: [
      {
        field: "canonical_url",
        old_value: "https://old.example.gov/program",
        new_value: "https://example.gov/program",
      },
    ],
    confidence: 0.99,
    risk_level: "LOW",
    material_fields_changed: [],
    ...overrides,
  };
}

test("allows a fully verified low-risk official update", () => {
  const result = processKnowledgeUpdate(makeUpdate());
  assert.equal(result.accepted, true);
  assert.equal(result.auto_publish_eligible, true);
  assert.equal(result.status, "APPROVED");
});

test("routes deadline changes to human review", () => {
  const result = processKnowledgeUpdate(
    makeUpdate({
      proposed_changes: [{ field: "deadline", new_value: "2026-09-01" }],
      material_fields_changed: ["deadline"],
    }),
  );
  assert.equal(result.auto_publish_eligible, false);
  assert.equal(result.status, "APPROVAL_PENDING");
});

test("rejects incomplete proposals without changing trusted knowledge", () => {
  const result = processKnowledgeUpdate(makeUpdate({ evidence: [] }));
  assert.equal(result.accepted, false);
  assert.equal(result.status, "VALIDATION_PENDING");
  assert.ok(result.errors.length > 0);
});
