const DEFAULT_WORKING_MEMORY_DAYS = 30;

function config() {
  const url = process.env.RDA_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.RDA_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

async function db(path, options = {}) {
  const cfg = config();
  if (!cfg) return null;

  const response = await fetch(`${cfg.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`RDA memory store failed (${response.status}): ${detail.slice(0, 240)}`);
  }

  if (response.status === 204) return [];
  return response.json();
}

function compactText(value, max = 1200) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function memorySummary(working, durable = []) {
  const sections = [];

  if (working) {
    sections.push(
      [
        "ACTIVE SESSION MEMORY:",
        working.goal ? `Goal: ${working.goal}` : null,
        working.context_summary ? `Context: ${working.context_summary}` : null,
        working.constraints?.length
          ? `Known constraints: ${JSON.stringify(working.constraints).slice(0, 900)}`
          : null,
        working.rejected_options?.length
          ? `Rejected/failed routes: ${JSON.stringify(working.rejected_options).slice(0, 900)}`
          : null,
        working.unresolved_questions?.length
          ? `Unresolved: ${JSON.stringify(working.unresolved_questions).slice(0, 700)}`
          : null,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  if (durable.length) {
    sections.push(
      `DURABLE USER MEMORY (use only when relevant):\n${durable
        .slice(0, 12)
        .map(item => `- [${item.category}] ${item.fact}`)
        .join("\n")}`,
    );
  }

  return sections.join("\n\n");
}

export function memoryConfigured() {
  return Boolean(config());
}

export async function loadMemory({ sessionId, trustedUserId = null }) {
  if (!config()) return { working: null, durable: [], context: "" };

  let working = null;
  if (sessionId) {
    const rows = await db(
      `rda_working_memory?session_id=eq.${encodeURIComponent(sessionId)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&limit=1`,
    );
    working = rows?.[0] || null;
  }

  let durable = [];
  // IMPORTANT: trustedUserId must come from verified server-side authentication,
  // never directly from an untrusted request body.
  if (trustedUserId) {
    durable =
      (await db(
        `rda_user_memory?user_id=eq.${encodeURIComponent(trustedUserId)}&active=eq.true&or=(expires_at.is.null,expires_at.gt.${encodeURIComponent(new Date().toISOString())})&order=updated_at.desc&limit=25`,
      )) || [];
  }

  return { working, durable, context: memorySummary(working, durable) };
}

export async function saveWorkingMemory({
  sessionId,
  trustedUserId = null,
  query,
  answer,
  goal = null,
  contextSummary = null,
  constraints = null,
  rejectedOptions = null,
  unresolvedQuestions = null,
  pathwayState = null,
}) {
  if (!config() || !sessionId) return null;

  const expiresAt = new Date(
    Date.now() + DEFAULT_WORKING_MEMORY_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const row = {
    session_id: sessionId,
    user_id: trustedUserId,
    goal: compactText(goal || query, 500),
    context_summary: compactText(contextSummary || answer, 1600),
    last_query: compactText(query, 1200),
    last_answer: compactText(answer, 2400),
    updated_at: new Date().toISOString(),
    expires_at: expiresAt,
  };

  if (Array.isArray(constraints)) row.constraints = constraints.slice(0, 20);
  if (Array.isArray(rejectedOptions)) row.rejected_options = rejectedOptions.slice(0, 20);
  if (Array.isArray(unresolvedQuestions)) row.unresolved_questions = unresolvedQuestions.slice(0, 20);
  if (pathwayState && typeof pathwayState === "object") row.pathway_state = pathwayState;

  return db("rda_working_memory?on_conflict=session_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(row),
  });
}

export async function saveDurableMemory({
  trustedUserId,
  category,
  key,
  fact,
  structuredValue = null,
  provenance = "user_confirmed",
  sensitivity = "standard",
  confidence = null,
  consentConfirmed = false,
}) {
  if (!config() || !trustedUserId || !consentConfirmed) return null;
  if (!category || !key || !fact) throw new Error("Durable memory requires category, key, and fact.");

  const now = new Date().toISOString();
  const current = await db(
    `rda_user_memory?user_id=eq.${encodeURIComponent(trustedUserId)}&category=eq.${encodeURIComponent(category)}&memory_key=eq.${encodeURIComponent(key)}&active=eq.true&limit=1`,
  );

  if (current?.[0]) {
    await db(`rda_user_memory?id=eq.${current[0].id}`, {
      method: "PATCH",
      body: JSON.stringify({ active: false, updated_at: now }),
    });
  }

  const payload = {
    user_id: trustedUserId,
    category,
    memory_key: key,
    fact: compactText(fact, 1200),
    structured_value: structuredValue,
    provenance,
    sensitivity,
    confidence,
    active: true,
    supersedes_id: current?.[0]?.id || null,
    last_confirmed_at: now,
    updated_at: now,
  };

  const created = await db("rda_user_memory", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  await db("rda_memory_events", {
    method: "POST",
    body: JSON.stringify({
      user_id: trustedUserId,
      memory_id: created?.[0]?.id || null,
      event_type: current?.[0] ? "memory_superseded" : "memory_created",
      actor_type: "user_authorized",
      metadata: { category, key, sensitivity },
    }),
  });

  return created?.[0] || null;
}
