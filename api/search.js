import OpenAI from "openai";
import { runRdaMaestro } from "../lib/agents/orchestrator.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  const candidates = Array.isArray(body.candidates) ? body.candidates.slice(0, 5) : [];

  if (!query) {
    return response.status(400).json({ error: "A resource question is required." });
  }

  try {
    const result = await runRdaMaestro({
      client,
      query,
      routingSummary,
      candidates,
      model: process.env.RDA_MODEL || "gpt-5",
    });

    return response.status(200).json({
      answer: result.answer,
      responseId: result.responseId,
      checkedAt: new Date().toISOString(),
      agentsApplied: result.agentsApplied,
      skillsApplied: result.skillsApplied,
      agentFailures: result.agentFailures,
      agentRuns: result.agentRuns.map(run => ({
        agentId: run.agentId,
        responseId: run.responseId,
        skillsApplied: run.skillsApplied,
      })),
    });
  } catch (error) {
    console.error("RDA Maestro search failed", error);
    return response.status(500).json({
      error: "The multi-agent resource search could not be completed. Please try again.",
    });
  }
}
