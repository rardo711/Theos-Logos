/**
 * Orientation for a verse the desk could not source.
 *
 * Everywhere else in the reception engine, Gemini is a librarian working
 * strictly inside fetched text: retrieve-assemble's parseRetrieved rejects any
 * quote that is not a substring of the page it came from, and synthesize's
 * parseSynthesis rejects any quote not already on the desk. That is the right
 * default, and this module does not weaken it.
 *
 * It covers the case those two leave bare. When the catalog has no page for a
 * verse, or the librarian read every fetched page and rejected all of them,
 * the reader gets an empty panel and a caution. Something useful can still be
 * said there without inventing a source: what the interpretive question at
 * this verse is, which traditions divide over it and on what grounds, and
 * which works to go read. That is orientation, not testimony.
 *
 * The rules this file enforces come from the primary-source-retrieval skill
 * (.claude/skills/primary-source-retrieval/SKILL.md), which permits exactly
 * one thing beyond fetched text -- a brief read, marked as synthesis rather
 * than as the sources' own words -- and forbids the rest:
 *
 *   - No quotation. Nothing fetched, so nothing may be quoted. A fabricated
 *     Chrysostom sentence is the precise failure this branch spent its
 *     history removing from the desk.
 *   - No invented citations. Works may be named; section and article numbers
 *     may not be guessed, and no URL may be produced at all.
 *   - No verdict on a contested question. Give the shape of the dispute.
 *
 * parseOrientation enforces the first two structurally rather than trusting
 * the prompt. The third is a matter of prompt and review.
 */
import type { Locale } from "../bible/books.ts";
import type { DeskOrientation } from "../bible/types.ts";
import { geminiApiKey, generateGeminiJson } from "../ai/gemini.ts";

/**
 * A quoted span this long is a quotation, and every quotation here would be
 * from memory. Short quoted spans are allowed and are usually the useful kind:
 * a Greek or Latin term under dispute (eph' ho, katertismena, dikaioo).
 */
const MAX_QUOTED_SPAN = 60;

/** Straight and curly double quotes; single quotes are left alone for terms like eph' ho. */
const QUOTED_SPAN = /["“]([^"“”]*)["”]/g;

export function hasLongQuotedSpan(text: string): boolean {
  for (const match of text.matchAll(QUOTED_SPAN)) {
    if ((match[1]?.trim().length ?? 0) > MAX_QUOTED_SPAN) return true;
  }
  return false;
}

export function hasUrl(text: string): boolean {
  return /https?:\/\/|www\./i.test(text);
}

export function orientationSystem(locale: Locale): string {
  const language =
    locale === "es"
      ? "Write every field in Spanish. Greek and Latin terms stay in their own language."
      : "Write every field in English. Greek and Latin terms stay in their own language.";

  return [
    "You are a research librarian for Theos Logos, not a theologian generating claims. The reader owns the theology; you point them at the reading.",
    "",
    "You have fetched NOTHING. No page was retrieved for this verse. That governs everything below.",
    "",
    "STRICT RULES:",
    "1. NO QUOTATION. Do not produce any sentence as the words of Augustine, Calvin, Chrysostom, Aquinas, or anyone else. You are working from memory, and a quotation from memory is a fabrication. You may name a short technical term under dispute (a Greek or Latin word) in quotes; you may not quote a clause or a sentence.",
    "2. NO INVENTED CITATIONS. Name a work plainly (\"Institutes, Book III\" only if you are certain; otherwise just \"the Institutes\"). Do not guess article, question, homily, or section numbers. Never output a URL.",
    "3. NO VERDICT. Where the question is genuinely contested, give the shape of the dispute and the strongest form of each side. Do not adjudicate it and do not signal which side you find persuasive.",
    "4. OWN CATEGORIES. State a Catholic, Eastern Orthodox, Lutheran, Arminian, or any other position as that tradition's own best advocates would state it, using their vocabulary and their reasons. Never a caricature drawn by an opponent.",
    "5. ONLY WHAT THE VERSE RAISES. If this verse has no substantive interpretive history -- a greeting, a travel note, a name list -- return {\"question\":\"\",\"divides\":[],\"read_next\":[]}. An empty answer is correct far more often than a padded one.",
    "6. PROSE. Plain and dry. No rhetorical antithesis of the form \"not X, but Y\". No flourish, no homily, no exhortation.",
    `7. ${language}`,
    "",
    "Return valid JSON only:",
    "{",
    '  "question": string,        // one or two sentences: the interpretive question this verse actually raises',
    '  "divides": [               // 0-4 entries; omit entirely if the verse is not contested',
    '    { "tradition": string, "position": string }',
    "  ],",
    '  "read_next": string[]      // 0-5 work names to consult. Names only. No section numbers you are unsure of, no URLs.',
    "}",
  ].join("\n");
}

export function orientationUser(opts: {
  reference: string;
  verseText: string;
  question?: string;
}): string {
  return [
    `Verse: ${opts.reference}`,
    opts.verseText ? `Text: ${opts.verseText}` : "",
    opts.question ? `The reader asked: "${opts.question}"` : "",
    "",
    "The desk retrieved no usable primary source for this verse. Orient the reader.",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Rejects rather than repairs. A model that produced a fabricated quotation or
 * a guessed URL was not following the brief, and salvaging the rest of that
 * response is how a bad habit reaches the reader in a smaller font.
 */
export function parseOrientation(raw: string): DeskOrientation | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  let parsed: {
    question?: unknown;
    divides?: unknown;
    read_next?: unknown;
  };
  try {
    parsed = JSON.parse(raw.slice(start, end + 1));
  } catch {
    return null;
  }

  const question = typeof parsed.question === "string" ? parsed.question.trim() : "";
  if (!question) return null;

  const divides: DeskOrientation["divides"] = [];
  if (Array.isArray(parsed.divides)) {
    for (const row of parsed.divides) {
      if (!row || typeof row !== "object") continue;
      const r = row as { tradition?: unknown; position?: unknown };
      const tradition = typeof r.tradition === "string" ? r.tradition.trim() : "";
      const position = typeof r.position === "string" ? r.position.trim() : "";
      if (!tradition || !position) continue;
      divides.push({
        tradition: tradition.slice(0, 60),
        position: position.slice(0, 400),
      });
      if (divides.length >= 4) break;
    }
  }

  const readNext: string[] = [];
  if (Array.isArray(parsed.read_next)) {
    for (const item of parsed.read_next) {
      if (typeof item !== "string") continue;
      const work = item.trim();
      if (!work) continue;
      readNext.push(work.slice(0, 120));
      if (readNext.length >= 5) break;
    }
  }

  const everything = [
    question,
    ...divides.flatMap((d) => [d.tradition, d.position]),
    ...readNext,
  ].join("\n");

  if (hasUrl(everything)) return null;
  if (hasLongQuotedSpan(everything)) return null;

  return { question: question.slice(0, 400), divides, readNext };
}

/**
 * Returns null on every failure path, including a missing key. Orientation is
 * an extra: a verse with no sources should degrade to the existing caution,
 * never to an error.
 */
export async function orientForVerse(opts: {
  reference: string;
  verseText: string;
  question?: string;
  locale?: Locale;
}): Promise<DeskOrientation | null> {
  if (!geminiApiKey()) return null;
  const locale: Locale = opts.locale === "es" ? "es" : "en";

  let text: string;
  try {
    text = await generateGeminiJson({
      system: orientationSystem(locale),
      user: orientationUser(opts),
      // Not 0.0: this is the one call in the engine with no source text to be
      // faithful to, and a slightly warmer sample reads less like a template.
      temperature: 0.3,
      maxOutputTokens: 700,
    });
  } catch (err) {
    console.warn(
      `[reception] orientation call failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    return null;
  }

  const oriented = parseOrientation(text);
  if (!oriented) {
    console.warn(`[reception] orientation rejected for ${opts.reference}`);
    return null;
  }
  return oriented;
}
