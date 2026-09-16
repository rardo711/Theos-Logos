/**
 * Google Cloud Translation (NMT) — server-only env wiring.
 * Never expose credentials to the client.
 */

export const TRANSLATE_ENGINE = "google-nmt" as const;

export type TranslateEngine = typeof TRANSLATE_ENGINE;

/** Prefer API key; service-account JSON path is also accepted. */
export function googleTranslateApiKey(): string | undefined {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
  return key || undefined;
}

export function googleApplicationCredentialsPath(): string | undefined {
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  return path || undefined;
}

export function translateConfigured(): boolean {
  return Boolean(googleTranslateApiKey() || googleApplicationCredentialsPath());
}
