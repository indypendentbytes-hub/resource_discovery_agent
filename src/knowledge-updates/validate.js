const REQUIRED_STRING_FIELDS = [
  "update_id",
  "source_id",
  "change_type",
  "status",
  "source_url",
  "source_organization",
  "authority_class",
  "retrieved_at",
  "risk_level",
];

export function validateKnowledgeUpdate(update) {
  const errors = [];

  if (!update || typeof update !== "object" || Array.isArray(update)) {
    return { valid: false, errors: ["Update must be an object."] };
  }

  for (const field of REQUIRED_STRING_FIELDS) {
    if (typeof update[field] !== "string" || update[field].trim() === "") {
      errors.push(`${field} must be a non-empty string.`);
    }
  }

  try {
    new URL(update.source_url);
  } catch {
    errors.push("source_url must be a valid URL.");
  }

  if (!Number.isFinite(update.confidence) || update.confidence < 0 || update.confidence > 1) {
    errors.push("confidence must be a number between 0 and 1.");
  }

  if (!Array.isArray(update.evidence) || update.evidence.length === 0) {
    errors.push("evidence must contain at least one record.");
  } else {
    update.evidence.forEach((item, index) => {
      if (!item?.claim || !item?.supporting_text || !item?.source_url) {
        errors.push(`evidence[${index}] must include claim, supporting_text, and source_url.`);
      }
    });
  }

  if (!Array.isArray(update.proposed_changes) || update.proposed_changes.length === 0) {
    errors.push("proposed_changes must contain at least one change.");
  } else {
    update.proposed_changes.forEach((change, index) => {
      if (typeof change?.field !== "string" || !("new_value" in change)) {
        errors.push(`proposed_changes[${index}] must include field and new_value.`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}
