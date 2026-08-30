/**
 * Server-only Gemini generateContent. Uses GEMINI_API_KEY (same name as main).
 * Default model is Flash so the Google AI Studio free tier stays usable.
 */

export function geminiApiKey(): string | undefined {
  const key = process.env.GEMINI_API_KEY?.trim();
  return key || undefined;
}

export function geminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
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
  const flash = model.toLowerCase().includes("flash");

  const body = {
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: [{ role: "user", parts: [{ text: opts.user }] }],
    generationConfig: {
      temperature: opts.temperature ?? 0.2,
      maxOutputTokens: opts.maxOutputTokens ?? 1100,
      responseMimeType: "application/json",
      ...(flash ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
    },
  };

  let lastError = "Gemini request failed.";
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

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
