import { evaluateUpdatePolicy } from "./policy.js";
import { validateKnowledgeUpdate } from "./validate.js";

export function processKnowledgeUpdate(update) {
  const validation = validateKnowledgeUpdate(update);

  if (!validation.valid) {
    return {
      accepted: false,
      status: "VALIDATION_PENDING",
      errors: validation.errors,
      update: null,
    };
  }

  const policy = evaluateUpdatePolicy(update);
  const processed = {
    ...update,
    status: policy.next_status,
    requires_human_review: policy.requires_human_review,
    policy_reasons: policy.reasons,
  };

  return {
    accepted: true,
    status: processed.status,
    auto_publish_eligible: policy.auto_publish_eligible,
    errors: [],
    update: processed,
  };
}
