const SKILLS = {
  "entity-resolution": {
    category: "identity",
    triggers: ["who is", "which organization", "same organization", "entity", "provider", "agency", "duplicate"],
    instructions: `Decide whether records refer to the same real-world person, organization, place, parcel, or program. Collect strong identifiers, compare exact and fuzzy matches, distinguish same entity from related-but-distinct entities, preserve aliases and provenance, and mark unresolved cases for review. Never silently merge conflicting records.`
  },
  "applicability-analysis": {
    category: "fit",
    triggers: ["apply", "applicable", "relevant", "eligible", "fit", "qualify", "does this apply"],
    instructions: `Determine whether a rule, program, resource, requirement, or opportunity actually applies to this user and situation. Identify scope, geography, entity type, thresholds, dates, exclusions, and conditional triggers. Separate confirmed applicability from likely, possible, and not applicable.`
  },
  "funding-fit-assessment": {
    category: "fit",
    triggers: ["grant", "funding", "loan", "award", "capital", "financial assistance", "rfp", "nofo"],
    instructions: `Assess whether a funding opportunity is worth pursuing. Check hard eligibility gates first, then strategic fit, competitiveness, capacity burden, match requirements, reporting load, and opportunity cost. Recommend pursue now, shape and return, watch, or pass. Do not default to applying.`
  },
  "requirement-extraction": {
    category: "requirements",
    triggers: ["requirement", "must", "need to", "deadline", "documentation", "eligibility", "compliance"],
    instructions: `Extract obligations into an executable checklist. For each requirement identify source, actor, trigger, action, evidence needed, timing, and consequence of missing it. Separate mandatory language from recommendations and marketing language.`
  },
  "dependency-mapping": {
    category: "pathway",
    triggers: ["depends", "before", "prerequisite", "sequence", "path", "next step", "blocked", "critical path"],
    instructions: `Map what has to happen before what. Distinguish hard prerequisites from soft dependencies, identify external dependencies, find the critical path, flag single points of failure, and name the next action that unlocks progress.`
  },
  "gap-classification": {
    category: "pathway",
    triggers: ["missing", "gap", "barrier", "constraint", "lack", "blocked", "need a"],
    instructions: `Classify the gap before recommending new capacity. Distinguish missing capacity, missing utilization, missing coordination, missing permission or funding, and missing evidence. Prefer use, rent, share, or partner when the problem is not truly missing capacity.`
  },
  "relationship-extraction": {
    category: "graph",
    triggers: ["partner", "administered by", "funded by", "works with", "relationship", "owned by", "member of"],
    instructions: `Extract typed, directional relationships between entities, such as funds, owns, employs, governs, supplies, buys from, sponsors, member of, and located in. Record source, date, confidence, and whether the relationship is informal or legally binding.`
  },
  "claims-to-evidence-mapping": {
    category: "evidence",
    triggers: ["evidence", "source", "prove", "verify", "citation", "support", "fact check"],
    instructions: `Map each material claim to evidence that is actually allowed to support it. Classify support as direct, indirect, analogical, or insufficient; record opposing evidence and gaps; and explicitly state what cannot yet be claimed.`
  },
  "source-provenance-capture": {
    category: "evidence",
    triggers: ["source", "provenance", "official", "verified", "freshness", "citation"],
    instructions: `Capture provenance for every material factual claim: source type, title, author or organization, date created, date accessed, URL or file identifier, extracted fact, and reliability notes. Prefer primary sources and preserve access dates and source identity.`
  },
  "contradiction-detection": {
    category: "evidence",
    triggers: ["conflict", "contradict", "different information", "inconsistent", "doesn't match", "disagree"],
    instructions: `When sources conflict, preserve both claims and diagnose whether the clash comes from different time periods, definitions, units, geography, or a true logical contradiction. Never average conflicting values or silently keep only the newer one.`
  },
  "claim-classification": {
    category: "evidence",
    triggers: ["claim", "fact", "inference", "estimate", "uncertain", "assumption"],
    instructions: `Classify material statements as sourced fact, inference, assumption, estimate, goal or preference, or normative claim. Never promote an inference or assumption to fact. Use the weaker class when uncertain.`
  },
  "scenario-comparison": {
    category: "decision",
    triggers: ["compare", "option", "alternative", "scenario", "versus", " vs ", "build or"],
    instructions: `Compare two to four real options, including do nothing when relevant, against the same criteria: fit, cost, time, risk, reversibility, and participant burden. State what would have to change for the losing option to become preferable.`
  },
  "sensitivity-analysis": {
    category: "decision",
    triggers: ["sensitivity", "assumption", "what if", "change if", "depends on", "switch point"],
    instructions: `Identify load-bearing assumptions, test plausible low and high values, and report the switch-point at which the recommendation changes. Prioritize verification of assumptions that can flip the decision.`
  },
  "second-order-effects-scan": {
    category: "decision",
    triggers: ["second order", "downstream", "unintended", "knock-on", "side effect", "what happens next"],
    instructions: `Look beyond the intended first-order effect. Identify displacement, capacity diversion, incentive changes, political or coalition effects, compliance residue, who absorbs costs, and whether the intervention can be reversed.`
  },
  "root-cause-analysis": {
    category: "diagnosis",
    triggers: ["why", "root cause", "failure", "problem", "not working", "keeps happening"],
    instructions: `Define the observable problem, gather a timeline, compare with the last known successful state, test causes across process, incentives, data, permissions, and capacity, distinguish contributing factors from root cause, and identify a disconfirming test.`
  },
  "experiment-design": {
    category: "validation",
    triggers: ["test", "pilot", "experiment", "validate", "trial", "prove the idea"],
    instructions: `Turn uncertainty into a falsifiable test. Define the question, hypothesis, unit, intervention and baseline, predefined success, failure, and inconclusive thresholds, duration, stop rule, and what the experiment cannot establish.`
  },
  "data-rights-classification": {
    category: "governance",
    triggers: ["data", "privacy", "license", "rights", "permission", "pii", "share data"],
    instructions: `Before data moves, classify subject, source and legal or consent basis, sensitivity, allowed uses, sharing scope, retention, deletion, and aggregation rules. Do not assume operational data is public merely because RDA is public.`
  },
  "structured-handoff": {
    category: "handoff",
    triggers: ["handoff", "refer", "escalate", "contact", "next action", "send to", "advisor"],
    instructions: `When work must move to another person or system, provide a compact handoff packet: what was done, what is true now, open questions, decision needed, owner, deadline, source links, relevant skills, and what should not be redone.`
  }
};

const ALWAYS_ON = ["source-provenance-capture", "claim-classification"];

function normalize(input) {
  if (typeof input === "string") return input.toLowerCase();
  if (!input || typeof input !== "object") return "";
  return [input.query, input.question, input.goal, input.context, input.constraints]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function listSkills() {
  return Object.entries(SKILLS).map(([id, skill]) => ({ id, category: skill.category, triggers: [...skill.triggers] }));
}

export function selectSkills(input, { maxSkills = 7 } = {}) {
  const text = normalize(input);
  const ranked = Object.entries(SKILLS)
    .map(([id, skill]) => ({
      id,
      category: skill.category,
      score: skill.triggers.reduce((score, trigger) => score + (text.includes(trigger) ? 1 : 0), 0)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  const selectedIds = [...ALWAYS_ON];
  for (const item of ranked) {
    if (!selectedIds.includes(item.id)) selectedIds.push(item.id);
    if (selectedIds.length >= maxSkills) break;
  }

  return selectedIds.slice(0, maxSkills).map(id => ({
    id,
    category: SKILLS[id].category,
    instructions: SKILLS[id].instructions
  }));
}

export function buildSkillContext(input, options) {
  return selectSkills(input, options)
    .map(skill => `### ${skill.id}\n${skill.instructions}`)
    .join("\n\n");
}
