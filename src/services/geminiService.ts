// All Gemini calls are proxied through the Express server.
// The API key never touches the client bundle.

export async function generateCommentary(
  passage: string,
  reference: string,
  context: string = "",
  selectedVerse?: number
): Promise<string> {
  const res = await fetch("/api/commentary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passage, reference, context, selectedVerse }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
    throw new Error(err.error || `Commentary request failed (${res.status})`);
  }
  const data = await res.json();
  return data.text;
}

export async function generateFollowUp(
  passage: string,
  reference: string,
  selectedText: string,
  question: string,
  fullCommentaryText?: string
): Promise<string> {
  const res = await fetch("/api/followup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passage, reference, selectedText, question, fullCommentaryText }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
    throw new Error(err.error || `Follow-up request failed (${res.status})`);
  }
  const data = await res.json();
  return data.text;
}
