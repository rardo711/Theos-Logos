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
]);

const FETCH_MS = 7_000;
const MAX_BYTES = 180_000;

export type FetchedExtract = {
  entry: CatalogEntry;
  url: string;
  paragraphs: string[];
};

export function htmlToText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/"/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function paragraphsFromHtml(html: string): string[] {
  const chunks = html.split(/<\/p>|<br\s*\/?>|<\/div>|<\/h[1-6]>/i);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const chunk of chunks) {
    const text = htmlToText(chunk);
    if (text.length < 80 || text.length > 1800) continue;
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
    // If no query, skip header-like boilerplate paragraphs
    return paragraphs
      .filter((p) => !isBoilerplate(p))
      .slice(0, limit);
  }
  const hits = paragraphs
    .map((p) => {
      if (isBoilerplate(p)) return { p, score: 0 };
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
    return paragraphs.filter((p) => !isBoilerplate(p)).slice(0, limit);
  }
  return hits;
}

function isBoilerplate(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 30) return true;
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("translated by") ||
    lower.startsWith("edited by") ||
    lower.startsWith("preface") ||
    lower.startsWith("contents") ||
    lower.startsWith("table of contents") ||
    lower.startsWith("index") ||
    lower.startsWith("title page") ||
    lower.includes("all rights reserved") ||
    lower.includes("union theological seminary") ||
    lower.includes("ccel.org") ||
    lower.includes("grand rapids, mi") ||
    lower.includes("wm. b. eerdmans")
  ) {
    return true;
  }
  return false;
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

function librarianSystem(locale: Locale, focused = false): string {
  const notes =
    locale === "es"
      ? "Locale is es. Write note fields in Spanish. Quotes stay in the source language of the extract."
      : "Locale is en. Write note fields in English. Quotes stay in the source language of the extract.";
  const countRule = focused
    ? "- Return 1 to 4 ADDITIONAL cards that uniquely answer the focus/question, different voices from a generic verse stack. Do not restate Augustine/Chrysostom/Calvin/Henry unless a quote uniquely answers. If the extracts only repeat that stack, return {\"cards\":[],\"caution\":\"No additional sources for that focus.\"}."
    : "- 3 to 4 cards, different voices. Short quotes (1–3 sentences).";
  return `You are a research librarian for Theos Logos. You fetch, verify, and organize. You do not own the theology.

Rules:
- Return JSON only: {"cards":[{voice,work,tradition,quote,note,citation,paraphrased,url}],"caution":string}
- tradition must be one of: patristic, reformed, lutheran, catholic, orthodox, confession, eastern-patristic, western-patristic, scholastic, puritan
- Quote ONLY from the FETCHED EXTRACTS. If a wording is not in an extract, omit that card.
- Never invent a citation or a URL. Use the extract's locus and url.
- ADD cards aimed at the focus/question. Do not restate a generic Augustine/Chrysostom/Calvin/Westminster stack unless a quote uniquely answers the question.
- paraphrased=false when the quote is taken verbatim (shortened only by ellipsis). paraphrased=true if you compress a sentence from the extract.
- ${countRule}
- Separate an author's own words from later interpretation. Label interpretation in note.
- No homily. No application. No celebrity pastors.
- ${notes}
- If the extracts do not treat the term as subject, return {"cards":[],"caution":"..."}.`;
}

export function extractsPrompt(
  extracts: FetchedExtract[],
  focus: string,
  locale: Locale = "en",
): string {
  const blocks = extracts.map((ex, i) => {
    const body = ex.paragraphs.map((p, n) => `(${n + 1}) ${p}`).join("\n");
    return [
      `EXTRACT ${i + 1}`,
      `voice: ${ex.entry.voice}`,
      `work: ${ex.entry.work}`,
      `tradition: ${ex.entry.tradition}`,
      `locus: ${ex.entry.locus}`,
      `url: ${ex.url}`,
      body,
    ].join("\n");
  });
  const localeLine =
    locale === "es"
      ? "Locale: es. Write note fields in Spanish. Quotes stay in the source language of the extract."
      : "Locale: en.";
  return [focus, localeLine, "", ...blocks].join("\n\n");
}

function cardsFromExtracts(extracts: FetchedExtract[]): SourceCard[] {
  const cards: SourceCard[] = [];
  for (const ex of extracts) {
    const validPara = ex.paragraphs.find((p) => !isBoilerplate(p));
    if (!validPara) continue;
    const quote = validPara.slice(0, 600);
    cards.push({
      voice: ex.entry.voice,
      work: ex.entry.work,
      tradition: ex.entry.tradition,
      quote,
      citation: `${ex.entry.locus} · ${ex.url}`,
      paraphrased: false,
      url: ex.url,
      source: "generated",
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

export function parseRetrieved(raw: string): SourceCard[] {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return [];
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1)) as {
      cards?: Array<Partial<SourceCard>>;
    };
    if (!Array.isArray(parsed.cards)) return [];
    const cards: SourceCard[] = [];
    for (const c of parsed.cards) {
      if (!c.voice || !c.quote || !c.citation) continue;
      const tradition = TRADITIONS.has(c.tradition as Tradition)
        ? (c.tradition as Tradition)
        : "patristic";
      cards.push({
        voice: String(c.voice).slice(0, 80),
        work: String(c.work ?? "").slice(0, 120),
        tradition,
        quote: String(c.quote).slice(0, 600),
        note: c.note ? String(c.note).slice(0, 280) : undefined,
        citation: String(c.citation).slice(0, 220),
        paraphrased: Boolean(c.paraphrased),
        url: c.url ? String(c.url).slice(0, 240) : undefined,
        source: "generated",
      });
      if (cards.length >= 5) break;
    }
    return cards;
  } catch {
    return [];
  }
}

export const RETRIEVAL_CAUTION =
  "Quoted from fetched public pages (New Advent, CCEL, Book of Concord). This set is not closed; a page can mis-transcribe. Verify against the Latin or printed edition before citing.";

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
      maxOutputTokens: 1600,
    });
    const cards = parseRetrieved(text);
    return {
      cards: cards.length ? cards : fallback.cards,
      caution: !cards.length && focused
        ? (locale === "es"
            ? "No se encontraron citas en las fuentes primarias recuperadas que respondan directamente a su consulta."
            : "No direct quotations found in the retrieved primary sources that address this inquiry.")
        : caution,
    };
  } catch {
    return fallback;
  }
}

