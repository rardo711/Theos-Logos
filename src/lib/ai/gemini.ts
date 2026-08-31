/**
 * Server-only Gemini generateContent. Uses GEMINI_API_KEY (same name as main).
 * Default model is Gemini 3.7 Flash (introductory rate $0.75/1M input,
 * $3.75/1M output through Dec 31, 2026; covered by the $10/month Google
 * Cloud credits included with Google AI Pro).
 */

/** Abort before Vercel’s 300s platform kill so Inquire can fall back. */
export const GEMINI_TIMEOUT_MS = 12_000;

const GEMINI_503_FALLBACK_MODEL = "gemini-3.6-flash";

export function geminiApiKey(): string | undefined {
  const key = process.env.GEMINI_API_KEY?.trim();
  return key || undefined;
}

export function geminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-3.7-flash";
}

function extractText(payload: unknown): string {
  const body = payload as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    error?: { message?: string };
  };
  if (body.error?.message) throw new Error(body.error.message);
  const parts = body.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p.text ?? "").join("").trim();
}

function isAbort(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.name === "AbortError" || err.name === "TimeoutError")
  );
}

function busyOrQuotaMessage(status: number): string {
  return status === 429
    ? "Gemini quota reached. Wait a moment and try again."
    : "Gemini is busy. Try again in a moment.";
}

export async function generateGeminiJson(opts: {
  system: string;
  user: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const apiKey = geminiApiKey();
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const primaryModel = geminiModel();

  async function callModel(model: string): Promise<{
    ok: boolean;
    status: number;
    parsed: unknown;
  }> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const flash = model.toLowerCase().includes("flash");
    const body = {
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: [{ role: "user", parts: [{ text: opts.user }] }],
      generationConfig: {
        temperature: opts.temperature ?? 0.2,
        maxOutputTokens: opts.maxOutputTokens ?? 1100,
        responseMimeType: "application/json",
        // 3.7 Flash ignores thinkingBudget:0 (2.5-era). LOW is the fastest level it accepts.
        ...(flash ? { thinkingConfig: { thinkingLevel: "LOW" } } : {}),
      },
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
      if (isAbort(err)) {
        throw new Error("Gemini timed out.");
      }
      throw err instanceof Error ? err : new Error("Gemini request failed.");
    }

    const raw = await res.text();
    let parsed: unknown = null;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      parsed = null;
    }
    return { ok: res.ok, status: res.status, parsed };
  }

  function finish(result: {
    ok: boolean;
    status: number;
    parsed: unknown;
  }): string {
    if (!result.ok) {
      if (result.status === 429 || result.status === 503) {
        throw new Error(busyOrQuotaMessage(result.status));
      }
      const msg =
        result.parsed && typeof result.parsed === "object" && result.parsed !== null
          ? extractText(result.parsed)
          : "";
      throw new Error(msg || `Gemini request failed (${result.status}).`);
    }
    const text = result.parsed ? extractText(result.parsed) : "";
    if (!text) throw new Error("Gemini returned an empty response.");
    return text;
  }

  // Call 1: primary (gemini-3.7-flash). No retry loop.
  let primary = await callModel(primaryModel);

  // HTTP 429: one short wait, one retry on 3.7 only. Do not fall back to 3.6 on 429.
  if (primary.status === 429) {
    await new Promise((r) => setTimeout(r, 400));
    primary = await callModel(primaryModel);
  }

  // HTTP 503 UNAVAILABLE: do not retry 3.7. One shot at 3.6 Flash (LOW).
  if (primary.status === 503) {
    const fallback = await callModel(GEMINI_503_FALLBACK_MODEL);
    return finish(fallback);
  }

  return finish(primary);
}
