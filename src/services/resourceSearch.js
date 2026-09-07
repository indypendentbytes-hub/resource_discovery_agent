const SESSION_STORAGE_KEY = "rda_session_id";

function getSessionId() {
  if (typeof window === "undefined") return "";

  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;

    const generated =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, "")
        : `rda_${Date.now()}_${Math.random().toString(36).slice(2, 18)}`;

    window.localStorage.setItem(SESSION_STORAGE_KEY, generated);
    return generated;
  } catch {
    return "";
  }
}

export async function searchResources({ query, routingSummary, candidates }) {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      routingSummary,
      candidates,
      sessionId: getSessionId(),
    }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The live search returned an unreadable response.");
  }

  if (!response.ok) {
    throw new Error(data.error || "The live resource search failed.");
  }

  return data;
}
