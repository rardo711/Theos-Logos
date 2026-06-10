// All Gemini calls are proxied through the Express server.
// The API key never touches the client bundle.

/**
 * Streams commentary from the server as Server-Sent Events.
 * `onChunk` receives the accumulated text after each chunk so the UI
 * can render the commentary as it arrives. Resolves with the full text.
 */
export async function generateCommentary(
  passage: string,
  reference: string,
  question: string = "",
  selectedVerse?: number,
  onChunk?: (fullText: string) => void
): Promise<string> {
  const res = await fetch("/api/commentary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ passage, reference, question, selectedVerse }),
  });
  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
    throw new Error(err.error || `Commentary request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE events are separated by a blank line; keep any partial event buffered
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const line = event.trim();
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6);
      if (payload === "[DONE]") return fullText;

      let parsed: { text?: string; error?: string };
      try {
        parsed = JSON.parse(payload);
      } catch {
        continue;
      }
      if (parsed.error) throw new Error(parsed.error);
      if (parsed.text) {
        fullText += parsed.text;
        onChunk?.(fullText);
      }
    }
  }
  return fullText;
}

export async function generateWordStudy(
  word: string,
  reference: string = "",
): Promise<string> {
  const res = await fetch("/api/wordstudy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ word, reference }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
    throw new Error(err.error || `Word study request failed (${res.status})`);
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
