/**
 * Quoted spans inside a model's prose.
 *
 * Two callers, opposite purposes. orient.ts has no fetched text under it, so
 * any long quoted span there is a fabrication and the response is discarded.
 * synthesize.ts does have text under it, so a long quoted span there is a
 * claim to check against the desk rather than a defect on its own.
 *
 * Single quotes are deliberately not matched: apostrophes are ordinary in
 * English prose and in transliterated Greek (eph' ho), and treating them as
 * quotation marks produces spans that were never quotations.
 */
const QUOTED_SPAN = /["“]([^"“”]*)["”]/g;

export function quotedSpans(text: string): string[] {
  const out: string[] = [];
  for (const match of text.matchAll(QUOTED_SPAN)) {
    const span = match[1]?.trim();
    if (span) out.push(span);
  }
  return out;
}

/** Spans at or under this length are terms, not quotations: a Greek word, a phrase from the verse. */
export function longQuotedSpans(text: string, minLength: number): string[] {
  return quotedSpans(text).filter((span) => span.length > minLength);
}
