/**
 * Server-only Gemini generateContent. Uses GEMINI_API_KEY (same name as main).
 * Default is 3.6 Flash with low thinking — one step under 3.7, fewer tokens and less wait.
 */

/** Abort before Vercel’s platform kill so a busy model cannot hang Inquire. */
export const GEMINI_TIMEOUT_MS = 12_000;

export function geminiApiKey(): string | undefined {
  const key = process.env.GEMINI_API_KEY?.trim();
  return key || undefined;
}

export function geminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";
}

function thinkingConfig(model: string) {
  const id = model.toLowerCase();
  if (id.includes("gemini-3") || /\b3\.\d/.test(id)) {
    return { thinkingConfig: { thinkingLevel: "low" } };
  }
  if (id.includes("flash")) {
    return { thinkingConfig: { thinkingBudget: 0 } };
  }
  return {};
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

export async function generateGeminiJson(opts: {
  system: string;
  user: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const apiKey = geminiApiKey();
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const model = geminiModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

  const body = {
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: [{ role: "user", parts: [{ text: opts.user }] }],
    generationConfig: {
      temperature: opts.temperature ?? 0.2,
      maxOutputTokens: opts.maxOutputTokens ?? 1100,
      responseMimeType: "application/json",
      ...thinkingConfig(model),
    },
  };

  let lastError = "Gemini request failed.";
  for (let attempt = 0; attempt < 3; attempt++) {
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
        lastError = "Gemini timed out.";
        continue;
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

    if (res.status === 429 || res.status === 503) {
      lastError =
        res.status === 429
          ? "Gemini quota reached. Wait a moment and try again."
          : "Gemini is busy. Try again in a moment.";
      await new Promise((r) => setTimeout(r, 800 * 2 ** attempt));
      continue;
    }

    if (!res.ok) {
      const msg =
        parsed && typeof parsed === "object" && parsed !== null
          ? extractText(parsed)
          : "";
      throw new Error(msg || `Gemini request failed (${res.status}).`);
    }

    const text = parsed ? extractText(parsed) : "";
    if (!text) throw new Error("Gemini returned an empty response.");
    return text;
  }

  throw new Error(lastError);
}
