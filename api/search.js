import OpenAI from "openai";
import { runRdaMaestro } from "../lib/agents/orchestrator.js";
import {
  loadMemory,
  memoryConfigured,
  saveWorkingMemory,
} from "../lib/memory/index.js";

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

function validSessionId(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return /^[a-zA-Z0-9_-]{12,128}$/.test(trimmed) ? trimmed : "";
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
  const sessionId = validSessionId(body.sessionId);

  if (!query) {
    return response.status(400).json({ error: "A resource question is required." });
  }

  try {
    let memory = { working: null, durable: [], context: "" };
    if (sessionId) {
      try {
        // Long-term memory remains intentionally disabled here until the
        // Clerk identity on the request is verified server-side.
        memory = await loadMemory({ sessionId, trustedUserId: null });
      } catch (error) {
        console.warn("RDA memory read failed; continuing without memory", error);
      }
    }

    const result = await runRdaMaestro({
      client,
      query,
      routingSummary,
      candidates,
      memoryContext: memory.context,
      model: process.env.RDA_MODEL || "gpt-5",
    });

    if (sessionId) {
      try {
        await saveWorkingMemory({
          sessionId,
          trustedUserId: null,
          query,
          answer: result.answer,
          goal: memory.working?.goal || query,
          contextSummary: result.answer,
          constraints: memory.working?.constraints || [],
          rejectedOptions: memory.working?.rejected_options || [],
          unresolvedQuestions: memory.working?.unresolved_questions || [],
          pathwayState: {
            agentsApplied: result.agentsApplied,
            skillsApplied: result.skillsApplied,
            responseId: result.responseId,
          },
        });
      } catch (error) {
        console.warn("RDA memory write failed; answer still returned", error);
      }
    }

    return response.status(200).json({
      answer: result.answer,
      responseId: result.responseId,
      checkedAt: new Date().toISOString(),
      agentsApplied: result.agentsApplied,
      skillsApplied: result.skillsApplied,
      agentFailures: result.agentFailures,
      memory: {
        configured: memoryConfigured(),
        sessionId: sessionId || null,
        recalledWorkingMemory: Boolean(memory.working),
        durableMemoryEnabled: false,
      },
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
