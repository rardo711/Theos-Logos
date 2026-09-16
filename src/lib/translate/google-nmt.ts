/**
 * Google Cloud Translation API v2 (NMT). Server-only.
 * Auth: GOOGLE_TRANSLATE_API_KEY (preferred on Vercel) and/or
 * GOOGLE_APPLICATION_CREDENTIALS (service-account JSON path).
 */
import { readFile } from "node:fs/promises";
import { SignJWT, importPKCS8 } from "jose";
import {
  googleApplicationCredentialsPath,
  googleTranslateApiKey,
  translateConfigured,
} from "./engine.ts";

const V2 = "https://translation.googleapis.com/language/translate/v2";
const TIMEOUT_MS = 20_000;

type SaJson = {
  client_email?: string;
  private_key?: string;
  token_uri?: string;
};

let cachedAccessToken: { token: string; exp: number } | null = null;

export { translateConfigured };

async function serviceAccountAccessToken(): Promise<string | null> {
  const path = googleApplicationCredentialsPath();
  if (!path) return null;
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.exp > now + 60) {
    return cachedAccessToken.token;
  }
  try {
    const raw = await readFile(path, "utf8");
    const sa = JSON.parse(raw) as SaJson;
    if (!sa.client_email || !sa.private_key) return null;
    const key = await importPKCS8(sa.private_key, "RS256");
    const assertion = await new SignJWT({
      scope: "https://www.googleapis.com/auth/cloud-translation",
    })
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .setIssuer(sa.client_email)
      .setSubject(sa.client_email)
      .setAudience(sa.token_uri || "https://oauth2.googleapis.com/token")
      .setIssuedAt(now)
      .setExpirationTime(now + 3600)
      .sign(key);
    const tokenUri = sa.token_uri || "https://oauth2.googleapis.com/token";
    const res = await fetch(tokenUri, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.warn(`[translate] SA token HTTP ${res.status}`);
      return null;
    }
    const body = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!body.access_token) return null;
    cachedAccessToken = {
      token: body.access_token,
      exp: now + (body.expires_in ?? 3600),
    };
    return body.access_token;
  } catch (err) {
    console.warn(
      `[translate] SA auth failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }
}

type TranslateV2Response = {
  data?: { translations?: Array<{ translatedText?: string }> };
  error?: { message?: string };
};

/**
 * Translate HTML or plain strings EN→target. Returns null when credentials
 * are missing or the API call fails (caller keeps English / skips).
 */
export async function googleTranslateHtml(opts: {
  htmlParts: string[];
  source?: string;
  target: string;
}): Promise<string[] | null> {
  if (!opts.htmlParts.length) return [];
  if (!translateConfigured()) return null;

  const apiKey = googleTranslateApiKey();
  const bearer = apiKey ? null : await serviceAccountAccessToken();
  if (!apiKey && !bearer) {
    console.warn(
      "[translate] GOOGLE_TRANSLATE_API_KEY / GOOGLE_APPLICATION_CREDENTIALS unset or unusable — skipping NMT",
    );
    return null;
  }

  const url = apiKey ? `${V2}?key=${encodeURIComponent(apiKey)}` : V2;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        q: opts.htmlParts,
        source: opts.source ?? "en",
        target: opts.target,
        format: "html",
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const raw = await res.text();
    let parsed: TranslateV2Response | null = null;
    try {
      parsed = raw ? (JSON.parse(raw) as TranslateV2Response) : null;
    } catch {
      parsed = null;
    }
    if (!res.ok) {
      console.warn(
        `[translate] NMT HTTP ${res.status}: ${parsed?.error?.message ?? raw.slice(0, 200)}`,
      );
      return null;
    }
    const translations = parsed?.data?.translations;
    if (!translations || translations.length !== opts.htmlParts.length) {
      console.warn("[translate] NMT response size mismatch");
      return null;
    }
    return translations.map((t) => String(t.translatedText ?? ""));
  } catch (err) {
    console.warn(
      `[translate] NMT failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }
}

/** Test helper. */
export function clearSaTokenCache(): void {
  cachedAccessToken = null;
}
