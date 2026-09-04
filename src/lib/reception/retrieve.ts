import type { SourceCard, Tradition } from "../bible/types.ts";
import type { Locale } from "../bible/books.ts";
import { t } from "../i18n.ts";
import { geminiApiKey, generateGeminiJson } from "../ai/gemini.ts";
import { type CatalogEntry, mapCatalog, tokenize } from "./catalog.ts";

const HOSTS = new Set([
  "www.newadvent.org",
  "newadvent.org",
  "ccel.org",
  "www.ccel.org",
  "bookofconcord.org",
  "www.bookofconcord.org",
  "biblehub.com",
  "www.biblehub.com",
]);

const FETCH_MS = 7_000;
const MAX_BYTES = 180_000;

export type FetchedExtract = {
  entry: CatalogEntry;
  url: string;
  paragraphs: string[];
};

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, " ")
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, " ")
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, " ")
    .replace(/<table\b[^>]*class=["'][^"']*book_navbar[^"']*["'][^>]*>[\s\S]*?<\/table>/gi, " ")
    .replace(
      /<div\b[^>]*(?:id|class)=["'][^"']*(?:navbar|header|banner|workinfo|reader-toc|selection-popup|popover|nav-top|book_menu|searchbox|usertagbar|toolbar|crumbs|breadcrumb)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
      " ",
    );
}

export function htmlToText(html: string): string {
  const clean = sanitizeHtml(html);
  return clean
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/"/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/&mdash;/gi, "\u2014")
    .replace(/&ndash;/gi, "\u2013")
    .replace(/&hellip;/gi, "...")
    .replace(/\s+/g, " ")
    .trim();
}

export function isBoilerplate(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 15) return true;
  if (trimmed.length < 35 && !/[.;:?!]/.test(trimmed)) return true;
  const lower = trimmed.toLowerCase();

  if (
    lower.includes("christian classics ethereal library") ||
    lower.includes("ccel.org") ||
    lower.includes("browse titles") ||
    lower.includes("browse authors") ||
    lower.includes("work info:") ||
    lower.includes("work info") ||
    lower.includes("please help support the mission of new advent") ||
    (lower.includes("new advent") &&
      (lower.includes("instant download") ||
        lower.includes("catholic encyclopedia") ||
        lower.includes("home >"))) ||
    lower.includes("disable scripture popups") ||
    (lower.includes("bible version") && lower.includes("scripture popups")) ||
    lower.includes("theological markup language") ||
    lower.includes("pdf microsoft word") ||
    lower.includes("reader width") ||
    lower.includes("text size") ||
    lower.includes("show footnotes") ||
    lower.includes("search this book") ||
    lower.includes("search within this book") ||
    lower.includes("highlight selected text") ||
    lower.includes("please login or register") ||
    lower.includes("log in | register") ||
    lower.includes("all rights reserved") ||
    lower.includes("public domain") ||
    lower.includes("union theological seminary") ||
    lower.includes("grand rapids, mi") ||
    lower.includes("wm. b. eerdmans") ||
    lower.includes("baker book house") ||
    lower.includes("the following sermon is taken from volume") ||
    lower.includes("bible hub") ||
    lower.includes("biblehub") ||
    lower.includes("commentaries menu") ||
    lower.includes("parallel commentaries")
  ) {
    return true;
  }

  if (
    lower.startsWith("translated by") ||
    lower.startsWith("edited by") ||
    lower.startsWith("preface") ||
    lower.startsWith("contents") ||
    lower.startsWith("table of contents") ||
    lower.startsWith("index") ||
    lower.startsWith("title page") ||
    lower.startsWith("born:") ||
    lower.startsWith("died:") ||
    lower.startsWith("related topics:") ||
    lower.startsWith("work:") ||
    lower.startsWith("author:")
  ) {
    return true;
  }

  if (
    lower.includes("assorted sermons by martin luther") ||
    lower.includes("assorted sermons")
  ) {
    if (lower.split(/\s+/).length < 15) return true;
  }

  const pipeCount = (trimmed.match(/\|/g) || []).length;
  if (pipeCount >= 2) return true;

  const breadcrumbCount = (trimmed.match(/[>\u00bb\u00ab]/g) || []).length;
  if (breadcrumbCount >= 3) return true;

  if (trimmed.length >= 50 && !/[.;:?!]/.test(trimmed)) {
    return true;
  }

  const words = trimmed.split(/\s+/).filter((w) => w.length > 1);
  if (words.length >= 8) {
    const capitalized = words.filter((w) => /^[A-Z]/.test(w)).length;
    if (capitalized / words.length > 0.6) {
      return true;
    }
  }

  if (isEmbeddedScripture(text)) {
    return true;
  }

  return false;
}

export function isEmbeddedScripture(text: string): boolean {
  const trimmed = text.trim();
  const verseMarkers = trimmed.match(/(?:^|\.\s+|\s)\d{1,3}\s+[A-Z][a-z]+/g);
  if (verseMarkers && verseMarkers.length >= 2) {
    if (/^\d{1,3}\s+[A-Z]/.test(trimmed) || verseMarkers.length >= 3) {
      return true;
    }
  }
  return false;
}

export function truncateAtSentence(text: string, maxLen = 520): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;

  const sentenceMatches = Array.from(trimmed.matchAll(/[.!?](?=\s|$)/g));
  let bestCut = -1;
  for (const m of sentenceMatches) {
    const end = (m.index ?? 0) + 1;
    if (end <= maxLen && end >= 120) {
      bestCut = end;
    }
  }

  if (bestCut > 0) {
    return trimmed.slice(0, bestCut).trim();
  }

  const clauseMatches = Array.from(trimmed.matchAll(/[;:][\s]/g));
  for (const m of clauseMatches) {
    const end = (m.index ?? 0) + 1;
    if (end <= maxLen && end >= 120) {
      bestCut = end;
    }
  }
  if (bestCut > 0) {
    return trimmed.slice(0, bestCut).trim() + "\u2026";
  }

  const lastSpace = trimmed.lastIndexOf(" ", maxLen);
  if (lastSpace > 60) {
    return trimmed.slice(0, lastSpace).trim() + "\u2026";
  }

  return trimmed.slice(0, maxLen).trim() + "\u2026";
}

export function isSubstantiveQuote(text: string): boolean {
  if (isBoilerplate(text) || isEmbeddedScripture(text)) return false;
  const trimmed = text.trim();
  if (trimmed.length < 15) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;
  return true;
}

export function paragraphsFromHtml(html: string): string[] {
  const clean = sanitizeHtml(html);
  const chunks = clean.split(/<\/p>|<br\s*\/?>|<\/div>|<\/h[1-6]>/i);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const chunk of chunks) {
    const text = htmlToText(chunk);
    if (text.length < 80 || text.length > 2200) continue;
    if (isBoilerplate(text) || !isSubstantiveQuote(text)) continue;
    const key = text.slice(0, 80).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

export function pickParagraphs(
  paragraphs: string[],
  query: string,
  limit = 4,
): string[] {
  const tokens = tokenize(query);
  if (!tokens.length) {
    return paragraphs
      .filter((p) => !isBoilerplate(p) && isSubstantiveQuote(p))
      .slice(0, limit);
  }
  const hits = paragraphs
    .map((p) => {
      if (isBoilerplate(p) || !isSubstantiveQuote(p)) return { p, score: 0 };
      const lower = p.toLowerCase();
      let score = 0;
      for (const t of tokens) if (lower.includes(t)) score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);

  if (!hits.length) {
    return paragraphs
      .filter((p) => !isBoilerplate(p) && isSubstantiveQuote(p))
      .slice(0, limit);
  }
  return hits;
}

function allowed(url: string): boolean {
  try {
    return HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

async function getPage(url: string): Promise<string | null> {
  if (!allowed(url)) return null;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "TheosLogos/1.0 (primary-source retrieval; educational)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(FETCH_MS),
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const slice = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
    return new TextDecoder("utf-8", { fatal: false }).decode(slice);
  } catch {
    return null;
  }
}

export async function fetchEntry(
  entry: CatalogEntry,
  query: string,
): Promise<FetchedExtract | null> {
  for (const url of [entry.url, entry.altUrl].filter(Boolean) as string[]) {
    const html = await getPage(url);
    if (!html) continue;
    const paras = pickParagraphs(paragraphsFromHtml(html), query, 4);
    if (!paras.length) continue;
    return { entry, url, paragraphs: paras };
  }
  return null;
}

export async function retrieveExtracts(opts: {
  question: string;
  bookId?: string;
  chapter?: number;
  verseText?: string;
  mode?: "reception" | "traditions";
  excludeUrls?: string[];
}): Promise<FetchedExtract[]> {
  const query = [opts.question, opts.verseText].filter(Boolean).join(" ");
  const focused = Boolean(opts.question.trim());
  const limit = focused ? 8 : 5;
  const exclude = new Set((opts.excludeUrls ?? []).filter(Boolean));
  const mapped = mapCatalog({
    ...opts,
    limit: exclude.size ? limit + 6 : limit,
  }).filter(
    (e) => !exclude.has(e.url) && !(e.altUrl && exclude.has(e.altUrl)),
  );
  const take = mapped.slice(0, limit);
  const found = await Promise.all(take.map((e) => fetchEntry(e, query)));
  return found.filter((x): x is FetchedExtract => x != null);
}

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
    : "- Return 2 to 4 cards, different voices. Short verbatim quotes (1\u20133 sentences).";

  return `You are a historical-theological reception extraction engine for the New Testament in Theos Logos. Your sole duty is to extract verbatim primary source quotations from the provided text chunk(s) that explicitly cite, expound, or comment upon the specified target verse.\n\nSTRICT OPERATIONAL RULES:\n1. REJECTION CRITERIA:\n   - If a provided text chunk DOES NOT directly quote, reference, or expound the specific target verse/pericope, set \"status\" to \"rejected\" and provide a brief \"rejection_reason\".\n   - Merely sharing a general theological theme (e.g., grace, election, faith, will, sin) or expounding an unrelated cross-reference (e.g., James 1 instead of Romans 9) requires immediate rejection.\n2. ZERO PARAMETRIC RECALL:\n   - You have no external memory. Work exclusively from the characters inside \"TEXT CHUNK\". Do not correct archaic spelling, modernize phrasing, or introduce outside sentences.\n3. VERBATIM EXTRACTION:\n   - The \"quote\" field must be an exact, character-for-character substring of \"TEXT CHUNK\". Ellipses (...) may only bridge non-essential clauses within that exact chunk.\n4. CONTEXT BRIDGE:\n   - The \"context_bridge\" must be strictly one concise sentence summarizing how the author applies or interprets the specific target verse in context.\n5. STRICT JSON OUTPUT:\n   - Return valid JSON matching this schema:\n   {\n     \"cards\": [\n       {\n         \"status\": \"valid\" | \"rejected\",\n         \"rejection_reason\": string,\n         \"voice\": string,\n         \"work\": string,\n         \"tradition\": \"patristic\" | \"reformed\" | \"lutheran\" | \"catholic\" | \"orthodox\" | \"confession\" | \"eastern-patristic\" | \"western-patristic\" | \"scholastic\" | \"puritan\",\n         \"quote\": string,\n         \"context_bridge\": string,\n         \"citation\": string,\n         \"url\": string\n       }\n     ],\n     \"caution\": string\n   }\n- ${countRule}\n- ${languageRule}`;
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
      grounded: true,
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
  "Quoted from fetched public pages (New Advent, CCEL, Book of Concord, Bible Hub). This set is not closed; a page can mis-transcribe. Verify against the Latin or printed edition before citing.";

export async function assembleFromSources(opts: {
  question: string;
  bookId?: string;
  chapter?: number;
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
  const fallback = {
    cards: focused ? [] : cardsFromExtracts(extracts),
    caution: focused && !geminiApiKey()
      ? t(locale, "cautionNoKey")
      : caution,
  };

  if (!geminiApiKey()) return fallback;

  try {
    const text = await generateGeminiJson({
      system: librarianSystem(locale, focused),
      user: extractsPrompt(extracts, opts.focus, locale),
      temperature: 0.0,
      maxOutputTokens: 1600,
    });
    const cards = parseRetrieved(text, extracts);
    return {
      cards: cards.length ? cards : fallback.cards,
      caution: !cards.length && focused
        ? (locale === "es"
            ? "No se encontraron citas en las fuentes primarias recuperadas que respondan directamente a su consulta."
            : "No direct quotations found in the retrieved primary sources that address this inquiry.")
        : !cards.length
          ? (locale === "es"
              ? "No hay comentarios hist\u00f3ricos verificados indexados para este vers\u00edculo todav\u00eda."
              : "No verified historical commentary indexed for this verse yet.")
          : caution,
    };
  } catch {
    return fallback;
  }
}
