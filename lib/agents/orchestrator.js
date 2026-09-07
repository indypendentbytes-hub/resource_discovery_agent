import { buildSkillContext, selectSkills } from "../skills/index.js";
import { AGENTS, getAgent, routeAgents } from "./registry.js";

const WEB_TOOL = {
  type: "web_search",
  search_context_size: "high",
  user_location: {
    type: "approximate",
    city: "Indianapolis",
    region: "Indiana",
    country: "US",
    timezone: "America/Indiana/Indianapolis",
  },
};

function candidateContext(candidates = []) {
  if (!candidates.length) {
    return "No governed catalog candidate matched strongly. Search for authoritative alternatives.";
  }

  return `Governed catalog candidates to verify first:\n${candidates
    .slice(0, 5)
    .map((resource, index) =>
      `${index + 1}. ${resource.title} — ${resource.details || "No details"} — freshness: ${resource.freshness || "unknown"}; citation: ${resource.citation || "none"}`,
    )
    .join("\n")}`;
}

function agentInstructions(agent) {
  return `You are the ${agent.name}, a specialized sub-agent inside the INDYpendent Bytes Resource Discovery Agent (RDA).\n\nYour responsibility:\n${agent.focus}\n\nRules:\n- Stay inside your assigned responsibility.\n- Use live web search when current or external evidence is required.\n- Prefer official government agencies, original program providers, and primary institutional sources.\n- Never invent eligibility, deadlines, requirements, availability, capacity, contact information, or citations.\n- Distinguish sourced facts from inference and uncertainty.\n- Keep findings concise and structured for another agent to consume.\n- For legal, tax, financing, zoning, food-safety, or compliance matters, report primary-source requirements without making a professional determination.`;
}

async function runResearchAgent(client, agentId, context, model) {
  const agent = getAgent(agentId);
  const skillInput = {
    query: context.query,
    context: `${context.routingSummary || ""} ${agent.skillCue}`,
  };
  const skills = selectSkills(skillInput, { maxSkills: 6 });
  const skillContext = buildSkillContext(skillInput, { maxSkills: 6 });

  const result = await client.responses.create({
    model,
    instructions: agentInstructions(agent),
    tools: [WEB_TOOL],
    input: `USER QUESTION:\n${context.query}\n\nLOCAL ROUTING SUMMARY:\n${context.routingSummary || "None"}\n\n${candidateContext(context.candidates)}\n\nRDA SKILL CONTEXT:\n${skillContext}`,
  });

  return {
    agentId,
    agentName: agent.name,
    responseId: result.id,
    skillsApplied: skills.map(skill => skill.id),
    output: result.output_text,
  };
}

async function runPathwayAgent(client, context, upstream, model) {
  const agent = AGENTS.pathway;
  const skillInput = {
    query: context.query,
    context: `${context.routingSummary || ""} ${agent.skillCue}`,
  };
  const skills = selectSkills(skillInput, { maxSkills: 7 });
  const skillContext = buildSkillContext(skillInput, { maxSkills: 7 });
  const upstreamText = upstream
    .map(item => `## ${item.agentName}\n${item.output}`)
    .join("\n\n");

  const result = await client.responses.create({
    model,
    instructions: agentInstructions(agent),
    input: `USER QUESTION:\n${context.query}\n\nLOCAL ROUTING SUMMARY:\n${context.routingSummary || "None"}\n\nUPSTREAM AGENT FINDINGS:\n${upstreamText}\n\nRDA SKILL CONTEXT:\n${skillContext}\n\nBuild an ordered pathway using only supported upstream findings. Explicitly identify blockers, prerequisites, parallel actions, decision points, and the single best next action.`,
  });

  return {
    agentId: "pathway",
    agentName: agent.name,
    responseId: result.id,
    skillsApplied: skills.map(skill => skill.id),
    output: result.output_text,
  };
}

async function synthesize(client, context, results, model) {
  const findings = results
    .map(item => `## ${item.agentName}\n${item.output}`)
    .join("\n\n");

  const result = await client.responses.create({
    model,
    instructions: `You are Maestro, the coordinating agent for the INDYpendent Bytes Resource Discovery Agent. Synthesize specialized agent findings into one decision-ready answer. Resolve disagreements conservatively, preserve uncertainty, do not invent facts, and never upgrade an unverified claim to confirmed. Rank resources by fit, friction, speed, stage appropriateness, and geography. The answer should give the user a clear pathway rather than a pile of links. Include resource name, fit, availability/deadline when known, eligibility status, geographic relevance, source references preserved from sub-agent findings, confidence/freshness when supported, and one concrete next step.`,
    input: `USER QUESTION:\n${context.query}\n\nLOCAL ROUTING SUMMARY:\n${context.routingSummary || "None"}\n\nSUB-AGENT FINDINGS:\n${findings}`,
  });

  return {
    answer: result.output_text,
    responseId: result.id,
  };
}

export async function runRdaMaestro({ client, query, routingSummary = "", candidates = [], model = "gpt-5" }) {
  const context = { query, routingSummary, candidates };
  const researchAgentIds = routeAgents(context);

  const settled = await Promise.allSettled(
    researchAgentIds.map(agentId => runResearchAgent(client, agentId, context, model)),
  );

  const researchResults = settled
    .filter(item => item.status === "fulfilled")
    .map(item => item.value);

  const failures = settled
    .map((item, index) => ({ item, agentId: researchAgentIds[index] }))
    .filter(({ item }) => item.status === "rejected")
    .map(({ item, agentId }) => ({ agentId, error: item.reason?.message || "Agent failed" }));

  if (!researchResults.length) {
    throw new Error("All RDA research sub-agents failed.");
  }

  const pathway = await runPathwayAgent(client, context, researchResults, model);
  const allResults = [...researchResults, pathway];
  const final = await synthesize(client, context, allResults, model);

  return {
    ...final,
    agentsApplied: allResults.map(result => result.agentId),
    agentRuns: allResults,
    agentFailures: failures,
    skillsApplied: [...new Set(allResults.flatMap(result => result.skillsApplied))],
  };
}
