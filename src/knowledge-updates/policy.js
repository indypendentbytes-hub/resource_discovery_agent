const MATERIAL_FIELDS = new Set([
  "eligibility",
  "legal_or_compliance",
  "funding_amount",
  "deadline",
  "cost",
  "service_area",
  "application_route",
  "contact",
  "program_status",
  "partner_specific_knowledge",
]);

const AUTO_PUBLISH_AUTHORITIES = new Set([
  "LAW_OR_REGULATION",
  "OFFICIAL_GOVERNMENT_PROGRAM",
  "OFFICIAL_PROVIDER",
  "UNIVERSITY_OR_EXTENSION",
]);

const LOW_RISK_FIELDS = new Set([
  "organization_name",
  "canonical_url",
  "description",
  "broken_link_replacement",
]);

export function evaluateUpdatePolicy(update) {
  const reasons = [];
  const materialFields = update.material_fields_changed ?? [];
  const proposedFields = (update.proposed_changes ?? []).map((change) => change.field);

  if (!AUTO_PUBLISH_AUTHORITIES.has(update.authority_class)) {
    reasons.push("Source authority is not eligible for automatic publication.");
  }

  if (update.confidence < 0.95) {
    reasons.push("Confidence is below the 0.95 automatic-publication threshold.");
  }

  if (update.risk_level !== "LOW") {
    reasons.push("Only LOW-risk updates may publish automatically.");
  }

  if (update.change_type === "CONFLICT" || update.change_type === "UNVERIFIED") {
    reasons.push("Conflicting or unverified updates require human review.");
  }

  if (materialFields.some((field) => MATERIAL_FIELDS.has(field))) {
    reasons.push("The update changes a material field.");
  }

  if (proposedFields.some((field) => !LOW_RISK_FIELDS.has(field))) {
    reasons.push("At least one proposed field is outside the low-risk allowlist.");
  }

  if (!Array.isArray(update.evidence) || update.evidence.length === 0) {
    reasons.push("At least one evidence record is required.");
  }

  const requiresHumanReview = reasons.length > 0;

  return {
    requires_human_review: requiresHumanReview,
    next_status: requiresHumanReview ? "APPROVAL_PENDING" : "APPROVED",
    auto_publish_eligible: !requiresHumanReview,
    reasons,
  };
}

export { LOW_RISK_FIELDS, MATERIAL_FIELDS };
