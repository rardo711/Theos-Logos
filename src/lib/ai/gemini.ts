/**
 * Server-only Gemini generateContent. Uses GEMINI_API_KEY (same name as main).
 * Default is gemini-3.5-flash for fast and reliable extraction without latency timeouts.
 * Gemini 3 rejects temperature and thinkingBudget; earlier models support temperature.
 */

export const GEMINI_TIMEOUT_MS = 25_000;
const FALLBACK_MODEL = "gemini-3.8-flash";

export function geminiApiKey(): string | undefined {
  const key = process.env.GEMINI_API_KEY?.trim();
  return key || undefined;
}

export function geminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash";
}

export function isGemini3(model: string): boolean {
  const id = model.toLowerCase();
  return (
    id.includes("gemini-3.7") ||
    id.includes("gemini-3.6") ||
    id.includes("gemini-3.8") ||
    id.includes("gemini-3-")
  );
}

export function generationConfigFor(
  model: string,
  opts: { temperature?: number; maxOutputTokens?: number },
): {
  temperature?: number;
  maxOutputTokens: number;
  responseMimeType: "application/json";
  thinkingConfig?: { thinkingLevel: "low" | "medium" | "high" };
} {
  const maxOutputTokens = opts.maxOutputTokens ?? 1600;
  if (isGemini3(model)) {
    return {
      maxOutputTokens,
      responseMimeType: "application/json" as const,
      thinkingConfig: { thinkingLevel: "low" as const },
    };
  }
  return {
    temperature: opts.temperature ?? 0.2,
    maxOutputTokens,
    responseMimeType: "application/json" as const,
  };
}

function extractText(payload: unknown): string {
  const body = payload as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
      finishReason?: string;
    }>;
    error?: { message?: string };
  };
  if (body.error?.message) throw new Error(body.error.message);
  const parts = body.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p.text ?? "").join("").trim();
}

function errorMessage(parsed: unknown, status: number): string {
  if (parsed && typeof parsed === "object" && parsed !== null) {
    const err = (parsed as { error?: { message?: string } }).error;
    if (err?.message) return err.message;
    try {
      return extractText(parsed);
    } catch (e) {
      if (e instanceof Error && e.message) return e.message;
    }
  }
  return `Gemini request failed (${status}).`;
}

function isAbort(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.name === "AbortError" || err.name === "TimeoutError")
  );
}

type CallResult =
  | { ok: true; text: string }
  | { ok: false; status: number; message: string };

async function callModel(
  apiKey: string,
  model: string,
  opts: {
    system: string;
    user: string;
    temperature?: number;
    maxOutputTokens?: number;
  },
): Promise<CallResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const body = {
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: [{ role: "user", parts: [{ text: opts.user }] }],
    generationConfig: generationConfigFor(model, opts),
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    });
  } catch (err) {
    if (isAbort(err)) return { ok: false, status: 408, message: "Gemini timed out." };
    throw err instanceof Error ? err : new Error("Gemini request failed.");
  }

  const raw = await res.text();
  let parsed: unknown = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    return { ok: false, status: res.status, message: errorMessage(parsed, res.status) };
  }

  try {
    const text = parsed ? extractText(parsed) : "";
    if (!text) return { ok: false, status: 502, message: "Gemini returned an empty response." };
    return { ok: true, text };
  } catch (err) {
    return {
      ok: false,
      status: 502,
      message: err instanceof Error ? err.message : "Gemini returned an empty response.",
    };
  }
}

export async function generateGeminiJson(opts: {
  system: string;
  user: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const apiKey = geminiApiKey();
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const primary = geminiModel();
  let result = await callModel(apiKey, primary, opts);

  // HTTP 429: one short wait, one retry on the primary (3.7) only. Do not 3.6 on 429.
  if (!result.ok && result.status === 429) {
    await new Promise((r) => setTimeout(r, 400));
    result = await callModel(apiKey, primary, opts);
  }

  // HTTP 503 UNAVAILABLE only: retry with fallback model.
  if (!result.ok && result.status === 503 && primary !== FALLBACK_MODEL) {
    result = await callModel(apiKey, FALLBACK_MODEL, opts);
  }

  if (!result.ok) {
    if (result.status === 429) {
      throw new Error("Gemini quota reached. Wait a moment and try again.");
    }
    throw new Error(result.message);
  }
  return result.text;
}
