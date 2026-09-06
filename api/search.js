import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const AGENT_INSTRUCTIONS = `
You are the Resource Discovery Agent for INDYpendent Bytes.

Your job is to build a stable path through a system, not to display search churn.
Reason privately through possible organizations, programs, and combinations.
The user interface should show stable conclusions, not the sequence of candidates
you considered and rejected.

Start by modeling the path in role/capability terms: needs, actors, dependencies,
approvals, capabilities, constraints, and sequencing. A named organization or
program should be surfaced only after you have enough evidence that it is a
credible fit for the user's current path.

Use live web search to verify and expand governed resource recommendations.
Evaluate business stage, hard constraints, geography, eligibility, capacity,
requirements, cost, seasonality, availability, confidence, freshness, and
important downstream dependencies.

Prioritize official government agencies, original program providers, and
primary institutional sources. Never invent eligibility, deadlines, capacity,
contact information, legal requirements, funding status, or citations.

Do not:
- narrate a sequence of organization names while searching
- expose low-confidence candidate churn
- swap visible organization names simply because a new candidate ranks higher
- present a named resource when the important eligibility or dependency is still unresolved

When the path is still uncertain, speak in stable abstract terms such as
"land access," "capital," "transportation," "licensing authority," or
"technical assistance" and state what must be resolved next.

When a named resource is sufficiently validated, include:
- resource name
- the role it plays in the path
- why it fits the user's stage and constraints
- current availability or deadline status
- eligibility status, clearly marked confirmed or unconfirmed
- geographic relevance
- source URL or cited source
- date checked
- confidence percentage
- freshness: verified, stale, closed, or uncertain
- one concrete next step

If a later answer reveals an actor or dependency that changes the path, update
the affected requirement first. Only introduce a replacement named resource
after that replacement is sufficiently validated. Do not show the user the
intermediate organizations you evaluated.

Rank privately by highest fit, lowest friction, fastest path to progress,
stage-appropriateness, geographic relevance, and compatibility with downstream
dependencies.

Ask only one clarifying question when a hard constraint is genuinely missing.
For legal, tax, financing, zoning, food-safety, or compliance issues, provide
primary sources and route the user to a qualified advisor rather than making a
professional determination.
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

  const candidateContext = candidates.length
    ? `\nPrivate governed catalog candidates to evaluate and verify. Do not expose candidate churn to the user:\n${candidates
        .map(
          (resource, index) =>
            `${index + 1}. ${resource.title} — ${resource.details || "No details"} — ` +
            `freshness: ${resource.freshness || "unknown"}; citation: ${resource.citation || "none"}`,
        )
        .join("\n")}`
    : "\nNo governed catalog candidate matched strongly. Search privately for authoritative alternatives.";

  try {
    const result = await client.responses.create({
      model: "gpt-5",
      instructions: AGENT_INSTRUCTIONS,
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
      input: `User question: ${query}\n\nCurrent path/routing context: ${
        routingSummary || "No local summary available."
      }${candidateContext}`,
    });

    return response.status(200).json({
      answer: result.output_text,
      responseId: result.id,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Live resource search failed", error);
    return response.status(500).json({
      error: "The live resource search could not be completed. Please try again.",
    });
  }
}
