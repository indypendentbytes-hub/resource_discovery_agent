/**
 * Browser-safe helpers that call our server API routes.
 * Never talks to Qdrant directly (API key stays on the server).
 */

export async function checkQdrantHealth() {
  const response = await fetch("/api/qdrant-health");
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Qdrant health check failed.");
  }
  return data;
}

/**
 * Vector search via server.
 * @param {{ vector: number[], limit?: number, filter?: object }} params
 */
export async function searchQdrant({ vector, limit = 8, filter } = {}) {
  const response = await fetch("/api/qdrant-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "search", vector, limit, filter }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Qdrant search failed.");
  }
  return data;
}

/** List/scroll points (admin-style preview). */
export async function scrollQdrant({ limit = 20, offset = null, filter } = {}) {
  const response = await fetch("/api/qdrant-search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "scroll", limit, offset, filter }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Qdrant scroll failed.");
  }
  return data;
}
