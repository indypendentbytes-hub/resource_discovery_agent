import { qdrantHealth } from "../lib/qdrant.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed." });
  }

  try {
    const health = await qdrantHealth();
    return response.status(200).json(health);
  } catch (error) {
    if (error.code === "QDRANT_NOT_CONFIGURED") {
      return response.status(503).json({
        ok: false,
        error: error.message,
        hint: "Add QDRANT_URL and QDRANT_API_KEY in .env.local (local) and Vercel env vars (production).",
      });
    }

    console.error("Qdrant health check failed", error);
    return response.status(error.status || 500).json({
      ok: false,
      error: error.message || "Qdrant health check failed.",
    });
  }
}
