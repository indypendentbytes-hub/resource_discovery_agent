import OpenAI from "openai";
import { runIntakeAgent } from "../src/agent/agents/intakeAgent.js";
import { runDiscoveryAgent } from "../src/agent/agents/discoveryAgent.js";
import { orchestrateResourceDiscovery } from "../src/agent/orchestrator.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const LIVE_DISCOVERY_INSTRUCTIONS = `
You are the live discovery and verification tool for the INDYpendent Bytes Resource Discovery Agent.

Your only job is to find and verify candidate resources. Deterministic application code will make the final eligibility, ranking, sequencing, gap-detection, and response decisions.

Search authoritative sources first:
1. official government agencies
2. original program providers
3. universities and Extension
4. established nonprofit or institutional providers
5. other sources only when primary sources are unavailable

Never invent eligibility, deadlines, capacity, contact information, legal requirements, funding status, or citations.

Return ONLY valid JSON. No Markdown and no prose outside the JSON object.

Shape:
{
  "resources": [
    {
      "name": "string",
      "provider": "string or null",
      "description": "string",
      "category": "growers | landHosts | infrastructure | training | financing | technicalAssistance | procurement | logistics | sharedUseFacilities | regulatorySupport | communityPartners",
      "stages": ["Idea | Pre-revenue | Early revenue | Growth | Stabilizing | Pivoting | Recovery"],
      "geography": "string or null",
      "eligibilityStatus": "confirmed | likely | potential | not_eligible | unknown",
      "eligibilityNotes": "string or null",
      "availability": "string or null",
      "deadline": "string or null",
      "requirements": ["string"],
      "benefits": ["string"],
      "cost": "number or null",
      "confidence": "number from 0 to 1",
      "freshness": "verified | stale | closed | uncertain",
      "verificationDate": "ISO date",
      "sourceUrl": "primary source URL or null",
      "sourceType": "primary | secondary | unknown",
      "friction": "number from 0 to 1",
      "nextAction": "one concrete action",
      "whyFit": "short factual fit explanation"
    }
  ]
}

If a fact is not confirmed, mark it unknown rather than inferring it.
Closed or expired programs may be returned only when useful to prevent a false recommendation; mark freshness "closed".
`;

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

function parseLiveResources(outputText) {
  if (typeof outputText !== "string" || !outputText.trim()) return [];

  const cleaned = outputText
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return [];

  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(parsed.resources) ? parsed.resources : [];
  } catch {
    return [];
  }
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({
      error: "Live search is not configured. Add OPENAI_API_KEY in Vercel.",
    });
  }

  const body = normalizeBody(request.body);
  const query = typeof body.query === "string" ? body.query.trim() : "";
  const routingSummary =
    typeof body.routingSummary === "string" ? body.routingSummary.trim() : "";
  const candidates = Array.isArray(body.candidates) ? body.candidates.slice(0, 8) : [];

  if (!query) {
    return response.status(400).json({ error: "A resource question is required." });
  }

  const intake = runIntakeAgent(query);
  const discoveryPlan = runDiscoveryAgent(intake);

  if (intake.escalationRequired) {
    const orchestration = orchestrateResourceDiscovery({
      query,
      catalogCandidates: candidates,
    });

    return response.status(200).json({
      ...orchestration,
      summary: intake.escalationSummary,
      checkedAt: new Date().toISOString(),
      responseId: null,
    });
  }

  const candidateContext = candidates.length
    ? `Governed catalog candidates to verify first:\n${JSON.stringify(candidates, null, 2)}`
    : "No governed catalog candidate matched strongly.";

  const searchPlan = discoveryPlan.tasks
    .map((task) => `- ${task.category}: ${task.query} — ${task.reason}`)
    .join("\n");

  try {
    const checkedAt = new Date().toISOString();
    const result = await client.responses.create({
      model: process.env.RDA_MODEL || "gpt-5",
      instructions: LIVE_DISCOVERY_INSTRUCTIONS,
      tools: [
        {
          type: "web_search",
          search_context_size: "high",
          user_location: {
            type: "approximate",
            city: "Indianapolis",
            region: "Indiana",
            country: "US",
            timezone: "America/Indiana/Indianapolis",
          },
        },
      ],
      input: [
        `User question: ${query}`,
        `Detected stage: ${intake.stage}`,
        `Detected geography: ${intake.geography || "unknown"}`,
        `Detected constraints: ${JSON.stringify(intake.constraints)}`,
        `Pathway tags: ${intake.pathwayTags.join(", ") || "none"}`,
        "",
        "Discovery plan:",
        searchPlan,
        "",
        `Local routing summary: ${routingSummary || "No local summary available."}`,
        candidateContext,
        "",
        "Find current authoritative candidates for the discovery plan. Verify governed catalog candidates before trusting their status.",
      ].join("\n"),
    });

    const liveCandidates = parseLiveResources(result.output_text);
    const orchestration = orchestrateResourceDiscovery({
      query,
      catalogCandidates: candidates,
      liveCandidates,
      checkedAt,
    });

    const structuredDiscoverySucceeded = liveCandidates.length > 0;
    const answer = structuredDiscoverySucceeded
      ? orchestration.answer
      : result.output_text || orchestration.answer;

    return response.status(200).json({
      ...orchestration,
      answer,
      responseId: result.id,
      checkedAt,
      summary: structuredDiscoverySucceeded
        ? `Verified and ranked ${orchestration.resources.length} viable resource matches across ${discoveryPlan.categories.length} pathway categories.`
        : "Live search completed, but its structured resource payload could not be parsed; local orchestration remains available.",
      discoveryStructured: structuredDiscoverySucceeded,
    });
  } catch (error) {
    console.error("Live resource search failed", error);
    return response.status(500).json({
      error: "The live resource search could not be completed. Please try again.",
    });
  }
}
