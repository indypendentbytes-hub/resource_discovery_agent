import { qdrantSearch, qdrantScroll } from "../lib/qdrant.js";

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

  const body = normalizeBody(request.body);
  const mode = body.mode === "scroll" ? "scroll" : "search";

  try {
    if (mode === "scroll") {
      const data = await qdrantScroll({
        limit: body.limit,
        offset: body.offset ?? null,
        filter: body.filter,
        with_payload: body.with_payload !== false,
      });
      return response.status(200).json(data);
    }

    const data = await qdrantSearch({
      vector: body.vector,
      limit: body.limit,
      filter: body.filter,
      with_payload: body.with_payload !== false,
    });
    return response.status(200).json(data);
  } catch (error) {
    if (error.code === "QDRANT_NOT_CONFIGURED") {
      return response.status(503).json({
        error: error.message,
        hint: "Add QDRANT_URL and QDRANT_API_KEY in .env.local and Vercel.",
      });
    }

    if (error.status === 400) {
      return response.status(400).json({ error: error.message });
    }

    console.error("Qdrant search failed", error);
    return response.status(error.status || 500).json({
      error: error.message || "Qdrant search failed.",
    });
  }
}
