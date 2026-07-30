export async function searchResources({ query, routingSummary, candidates }) {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, routingSummary, candidates }),
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
