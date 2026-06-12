// All Gemini calls are proxied through the Express server.
// The API key never touches the client bundle.
import { Lang } from "../i18n";

async function readSSEStream(
  endpoint: string,
  body: Record<string, unknown>,
  onChunk?: (fullText: string) => void,
): Promise<string> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify(body),
  });
  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const event of events) {
      const line = event.trim();
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6);
      if (payload === "[DONE]") return fullText;
      let parsed: { text?: string; error?: string };
      try { parsed = JSON.parse(payload); } catch { continue; }
      if (parsed.error) throw new Error(parsed.error);
      if (parsed.text) {
        fullText += parsed.text;
        onChunk?.(fullText);
      }
    }
  }
  return fullText;
}

export async function generateCommentary(
  passage: string,
  reference: string,
  question: string = "",
  selectedVerse?: number,
  onChunk?: (fullText: string) => void,
  lang: Lang = "en",
): Promise<string> {
  return readSSEStream("/api/commentary", { passage, reference, question, selectedVerse, lang }, onChunk);
}

export async function generateWordStudy(
  word: string,
  reference: string = "",
  lang: Lang = "en",
  onChunk?: (fullText: string) => void,
): Promise<string> {
  return readSSEStream("/api/wordstudy", { word, reference, lang }, onChunk);
}

export async function generateWordStudyExpand(
  word: string,
  reference: string = "",
  lang: Lang = "en",
  onChunk?: (fullText: string) => void,
): Promise<string> {
  return readSSEStream("/api/wordstudy/expand", { word, reference, lang }, onChunk);
}

export async function generateFollowUp(
  passage: string,
  reference: string,
  selectedText: string,
  question: string,
  fullCommentaryText?: string,
  lang: Lang = "en",
  onChunk?: (fullText: string) => void,
  selectedVerse?: number,
): Promise<string> {
  return readSSEStream(
    "/api/followup",
    { passage, reference, selectedText, question, fullCommentaryText, lang, selectedVerse },
    onChunk,
  );
}
