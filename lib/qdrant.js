/**
 * Server-side Qdrant REST helpers.
 * Reads QDRANT_URL, QDRANT_API_KEY, QDRANT_COLLECTION from env.
 * Never import this file from browser/React code.
 */

function requiredEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    const err = new Error(`${name} is not configured.`);
    err.code = "QDRANT_NOT_CONFIGURED";
    throw err;
  }
  return String(value).trim().replace(/\/$/, "");
}

export function getQdrantConfig() {
  return {
    url: requiredEnv("QDRANT_URL"),
    apiKey: requiredEnv("QDRANT_API_KEY"),
    collection: (process.env.QDRANT_COLLECTION || "resources").trim(),
  };
}

async function qdrantFetch(path, { method = "GET", body } = {}) {
  const { url, apiKey } = getQdrantConfig();
  const response = await fetch(`${url}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.status?.error ||
      data?.message ||
      `Qdrant request failed (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.details = data;
    throw err;
  }

  return data;
}

export async function qdrantHealth() {
  const { url, collection } = getQdrantConfig();
  const root = await qdrantFetch("/");
  let collectionInfo = null;
  try {
    collectionInfo = await qdrantFetch(`/collections/${encodeURIComponent(collection)}`);
  } catch {
    collectionInfo = { error: `Collection "${collection}" not found or inaccessible.` };
  }
  return {
    ok: true,
    url,
    collection,
    qdrant: root,
    collectionInfo,
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Vector search.
 * @param {object} opts
 * @param {number[]} opts.vector - embedding vector
 * @param {number} [opts.limit=8]
 * @param {object} [opts.filter] - Qdrant filter
 * @param {boolean} [opts.with_payload=true]
 */
export async function qdrantSearch({ vector, limit = 8, filter, with_payload = true }) {
  if (!Array.isArray(vector) || vector.length === 0) {
    const err = new Error("A non-empty vector is required for search.");
    err.status = 400;
    throw err;
  }

  const { collection } = getQdrantConfig();
  const body = {
    vector,
    limit: Math.min(Math.max(Number(limit) || 8, 1), 50),
    with_payload,
  };
  if (filter && typeof filter === "object") {
    body.filter = filter;
  }

  const data = await qdrantFetch(
    `/collections/${encodeURIComponent(collection)}/points/search`,
    { method: "POST", body },
  );

  return {
    results: data?.result || [],
    checkedAt: new Date().toISOString(),
  };
}

/**
 * Scroll / list points (no vector) — useful for admin previews.
 */
export async function qdrantScroll({ limit = 20, offset = null, filter, with_payload = true } = {}) {
  const { collection } = getQdrantConfig();
  const body = {
    limit: Math.min(Math.max(Number(limit) || 20, 1), 100),
    with_payload,
    with_vector: false,
  };
  if (offset != null) body.offset = offset;
  if (filter && typeof filter === "object") body.filter = filter;

  const data = await qdrantFetch(
    `/collections/${encodeURIComponent(collection)}/points/scroll`,
    { method: "POST", body },
  );

  return {
    points: data?.result?.points || [],
    next_page_offset: data?.result?.next_page_offset ?? null,
    checkedAt: new Date().toISOString(),
  };
}
