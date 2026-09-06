import { routeResources } from "../routingEngine.js";

const TAG_RULES = {
  cultivator: /\b(grower|farmer|farm|cultivat|produce|crop)\b/i,
  landHost: /\b(land host|landowner|vacant lot|property owner|offer land)\b/i,
  buyer: /\b(buyer|procurement|restaurant|institution|school|hospital|food pantry)\b/i,
  entrepreneur: /\b(business|startup|entrepreneur|company|llc|launch)\b/i,
  jobSeeker: /\b(job|employment|career|work search|hiring)\b/i,
  reentry: /\b(reentry|re-entry|formerly incarcerated|returning citizen)\b/i,
  veteran: /\b(veteran|military|service member)\b/i,
  disability: /\b(disab|accessible|accommodation)\b/i,
  dvSurvivor: /\b(domestic violence|dv survivor|survivor)\b/i,
};

function extractCapitalAmount(message) {
  const matches = [
    message.match(/\$\s*([\d,]+(?:\.\d{1,2})?)/),
    message.match(/\b(?:budget|capital|funds?|money)\s*(?:of|is|=|:)?\s*([\d,]+(?:\.\d{1,2})?)/i),
  ].filter(Boolean);

  if (!matches.length) return null;
  const value = Number(matches[0][1].replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}

function extractGoal(message, categories) {
  const cleaned = message.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 180) return cleaned;

  if (categories.length) {
    return `Find the next viable ${categories.join(", ")} resources for the user's stated objective.`;
  }

  return cleaned.slice(0, 177) + "...";
}

export function runIntakeAgent(message) {
  const routing = routeResources(message, []);
  const pathwayTags = Object.entries(TAG_RULES)
    .filter(([, pattern]) => pattern.test(message))
    .map(([tag]) => tag);

  const constraints = { ...routing.constraints };
  const capitalAmount = extractCapitalAmount(message);
  if (capitalAmount !== null) constraints.capitalAmount = capitalAmount;

  const missing = [];
  if (!constraints.geography) missing.push("geography");
  if (routing.stage === "Uncertain") missing.push("stage");
  if (!routing.categories.length) missing.push("resource_category");

  return {
    goal: extractGoal(message, routing.categories),
    originalMessage: message,
    stage: routing.stage,
    constraints,
    geography: constraints.geography || null,
    categories: routing.categories,
    pathwayTags,
    missing,
    escalationRequired: routing.state === "escalation",
    escalationSummary: routing.state === "escalation" ? routing.summary : null,
  };
}
