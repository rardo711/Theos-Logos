import type { SourceCard, Tradition } from "../bible/types.ts";
import type { Locale } from "../bible/books.ts";
import { t } from "../i18n.ts";
import { geminiApiKey, generateGeminiJson } from "../ai/gemini.ts";
import {
  type FetchedExtract,
  isBoilerplate,
  isEmbeddedScripture,
  isSubstantiveQuote,
  truncateAtSentence,
} from "./retrieve-html.ts";
import { retrieveExtracts } from "./retrieve-net.ts";

export function validateReceptionOutput(
  response: { status?: string; quote?: string } | string,
  originalChunk: string,
): boolean {
  const quote = typeof response === "string" ? response : response.quote;
  const status = typeof response === "string" ? "valid" : (response.status ?? "valid");
  if (status !== "valid" || !quote || !originalChunk) {
    return false;
  }

  const normalize = (str: string) =>
    str
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2014\u2013-]/g, " ")
      .replace(/[.,;:!?]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const cleanChunk = normalize(originalChunk);
  const cleanQuote = normalize(quote.replace(/\.\.\./g, " ").replace(/\u2026/g, " "));

  const segments = quote
    .split(/\.\.\.|\u2026/)
    .map((s) => normalize(s))
    .filter((s) => s.length >= 6);

  if (segments.length > 1) {
    return segments.every((seg) => cleanChunk.includes(seg));
  }

  return cleanChunk.includes(cleanQuote);
}

function librarianSystem(locale: Locale, focused = false): string {
  const languageRule =
    locale === "es"
      ? "Language: Write 'context_bridge' in Spanish. The 'quote' field MUST remain in the verbatim source language of the text chunk."
      : "Language: Write 'context_bridge' in English. The 'quote' field MUST remain in the verbatim source language of the text chunk.";

  const countRule = focused
    ? "- Return 1 to 4 ADDITIONAL cards that uniquely answer the focus/question, different voices from a generic verse stack. If the extracts only repeat that stack or do not treat the question, return {\"cards\":[],\"caution\":\"No additional sources for that focus.\"}"
    : "- Return 2 to 4 cards, different voices. Short verbatim quotes (1-3 sentences).";

  return `You are a historical-theological reception extraction engine for the New Testament in Theos Logos. Your sole duty is to extract verbatim primary source quotations from the provided text chunk(s) that explicitly cite, expound, or comment upon the specified target verse.\n\nSTRICT OPERATIONAL RULES:\n1. REJECTION CRITERIA:\n   - If a provided text chunk DOES NOT directly quote, reference, or expound the specific target verse/pericope, set \"status\" to \"rejected\" and provide a brief \"rejection_reason\".\n   - Merely sharing a general theological theme (e.g., grace, election, faith, will, sin) or expounding an unrelated cross-reference (e.g., James 1 instead of Romans 9) requires immediate rejection.\n2. ZERO PARAMETRIC RECALL:\n   - You have no external memory. Work exclusively from the characters inside \"TEXT CHUNK\". Do not correct archaic spelling, modernize phrasing, or introduce outside sentences.\n3. VERBATIM EXTRACTION:\n   - The \"quote\" field must be an exact, character-for-character substring of \"TEXT CHUNK\". Ellipses (...) may only bridge non-essential clauses within that exact chunk.\n4. CONTEXT BRIDGE:\n   - The \"context_bridge\" must be strictly one concise sentence summarizing how the author applies or interprets the specific target verse in context.\n5. STRICT JSON OUTPUT:\n   - Return valid JSON matching this schema:\n   {\n     \"cards\": [\n       {\n         \"status\": \"valid\" | \"rejected\",\n         \"rejection_reason\": string,\n         \"voice\": string,\n         \"work\": string,\n         \"tradition\": \"patristic\" | \"reformed\" | \"lutheran\" | \"catholic\" | \"orthodox\" | \"confession\" | \"eastern-patristic\" | \"western-patristic\" | \"scholastic\" | \"puritan\" | \"arminian\",\n         \"quote\": string,\n         \"context_bridge\": string,\n         \"citation\": string,\n         \"url\": string\n       }\n     ],\n     \"caution\": string\n   }\n- ${countRule}\n- ${languageRule}`;
}

export function extractsPrompt(
  extracts: FetchedExtract[],
  focus: string,
  locale: Locale = "en",
): string {
  const blocks = extracts.map((ex, i) => {
    const cleanParas = ex.paragraphs.filter(
      (p) => !isBoilerplate(p) && isSubstantiveQuote(p),
    );
    const body = cleanParas
      .slice(0, 4)
      .map((p, n) => `(${n + 1}) ${p}`)
      .join("\n\n");
    return [
      `=== SOURCE METADATA (${i + 1}) ===`,
      `voice: ${ex.entry.voice}`,
      `work: ${ex.entry.work}`,
      `tradition: ${ex.entry.tradition}`,
      `locus: ${ex.entry.locus}`,
      `url: ${ex.url}`,
      `TEXT CHUNK:`,
      `\"\"\"`,
      body,
      `\"\"\"`,
    ].join("\n");
  });
  const localeLine =
    locale === "es"
      ? "Locale: es. Write context_bridge in Spanish. Quotes stay in the source language of the extract."
      : "Locale: en.";
  return [focus, localeLine, "", ...blocks].join("\n\n");
}

function cardsFromExtracts(extracts: FetchedExtract[]): SourceCard[] {
  const cards: SourceCard[] = [];
  for (const ex of extracts) {
    const validPara = ex.paragraphs.find(
      (p) =>
        !isBoilerplate(p) &&
        isSubstantiveQuote(p) &&
        !isEmbeddedScripture(p),
    );
    if (!validPara) continue;
    const quote = truncateAtSentence(validPara, 520);
    cards.push({
      voice: ex.entry.voice,
      work: ex.entry.work,
      tradition: ex.entry.tradition,
      quote,
      citation: `${ex.entry.locus} \u00b7 ${ex.url}`,
      paraphrased: false,
      url: ex.url,
      source: "generated",
      // Not grounded: nothing checked that this paragraph treats the verse.
      // Only parseRetrieved, which validates the quote against the fetched
      // chunk, may claim grounding.
      grounded: false,
    });
    if (cards.length >= 4) break;
  }
  return cards;
}

const TRADITIONS = new Set<Tradition>([
  "patristic",
  "reformed",
  "lutheran",
  "catholic",
  "orthodox",
  "confession",
  "eastern-patristic",
  "western-patristic",
  "scholastic",
  "puritan",
  "arminian",
]);

export function parseRetrieved(
  raw: string,
  extracts?: FetchedExtract[],
): SourceCard[] {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return [];
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      cards?: Array<{
        status?: string;
        rejection_reason?: string;
        voice?: string;
        work?: string;
        tradition?: string;
        quote?: string;
        context_bridge?: string;
        note?: string;
        citation?: string;
        paraphrased?: boolean;
        url?: string;
      }>;
    };
    if (!Array.isArray(parsed.cards)) return [];

    const allChunkText = (extracts ?? [])
      .flatMap((e) => e.paragraphs)
      .join(" \n\n ");

    const cards: SourceCard[] = [];
    for (const c of parsed.cards) {
      if (c.status === "rejected") continue;
      if (!c.voice || !c.quote || !c.citation) continue;

      const quoteStr = String(c.quote).trim();
      if (isBoilerplate(quoteStr) || !isSubstantiveQuote(quoteStr)) continue;

      if (
        allChunkText &&
        !validateReceptionOutput({ status: "valid", quote: quoteStr }, allChunkText)
      ) {
        continue;
      }

      const tradition = TRADITIONS.has(c.tradition as Tradition)
        ? (c.tradition as Tradition)
        : "patristic";

      const contextBridge = c.context_bridge
        ? String(c.context_bridge).slice(0, 320)
        : undefined;

      cards.push({
        voice: String(c.voice).slice(0, 80),
        work: String(c.work ?? "").slice(0, 120),
        tradition,
        quote: truncateAtSentence(quoteStr, 600),
        note: c.note ? String(c.note).slice(0, 280) : contextBridge,
        contextBridge,
        citation: String(c.citation).slice(0, 220),
        paraphrased: false,
        url: c.url ? String(c.url).slice(0, 240) : undefined,
        source: "generated",
        grounded: true,
      });
      if (cards.length >= 5) break;
    }
    return cards;
  } catch {
    return [];
  }
}

export const RETRIEVAL_CAUTION =
  "Quoted from fetched public pages (New Advent, CCEL, Book of Concord, Bible Hub, Godrules). This set is not closed; a page can mis-transcribe. Verify against the Latin or printed edition before citing.";

export async function assembleFromSources(opts: {
  question: string;
  bookId?: string;
  chapter?: number;
  verse?: number | null;
  verseText?: string;
  mode?: "reception" | "traditions";
  focus: string;
  locale?: Locale;
  excludeUrls?: string[];
}): Promise<{ cards: SourceCard[]; caution: string } | null> {
  const extracts = await retrieveExtracts(opts);
  if (!extracts.length) return null;
  const locale: Locale = opts.locale === "es" ? "es" : "en";
  const caution = t(locale, "cautionRetrieved");
  const focused = Boolean(opts.question.trim());

  // Unvalidated page paragraphs. Offered only when the librarian never ran —
  // no key, or the call failed — and always labelled as unchecked.
  const unchecked = {
    cards: focused ? [] : cardsFromExtracts(extracts),
    caution: focused ? t(locale, "cautionNoKey") : t(locale, "cautionUnverified"),
  };

  if (!geminiApiKey()) {
    console.warn(
      `[reception] no GEMINI_API_KEY; returning ${unchecked.cards.length} unchecked extract(s)`,
    );
    return unchecked;
  }

  let text: string;
  try {
    text = await generateGeminiJson({
      system: librarianSystem(locale, focused),
      user: extractsPrompt(extracts, opts.focus, locale),
      temperature: 0.0,
      maxOutputTokens: 1600,
    });
  } catch (err) {
    console.warn(
      `[reception] librarian call failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    return unchecked;
  }

  const cards = parseRetrieved(text, extracts);
  if (cards.length) return { cards, caution };

  // The librarian ran and rejected every chunk as not treating this verse.
  // That verdict stands: handing back the first paragraph of each page is how
  // commentary on a neighbouring verse used to reach the desk.
  console.warn(
    `[reception] librarian rejected all ${extracts.length} extract(s) for this verse`,
  );
  return {
    cards: [],
    caution: focused
      ? locale === "es"
        ? "No se encontraron citas en las fuentes primarias recuperadas que respondan directamente a su consulta."
        : "No direct quotations found in the retrieved primary sources that address this inquiry."
      : t(locale, "cautionNoVerseMatch"),
  };
}
