import type { SourceCard, Tradition } from "../bible/types.ts";
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
  if (!tokens.length) return paragraphs.slice(0, limit);
  return paragraphs
    .map((p) => {
      const lower = p.toLowerCase();
      let score = 0;
      for (const t of tokens) if (lower.includes(t)) score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
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
}): Promise<FetchedExtract[]> {
  const query = [opts.question, opts.verseText].filter(Boolean).join(" ");
  const mapped = mapCatalog({ ...opts, limit: 5 });
  const found = await Promise.all(mapped.map((e) => fetchEntry(e, query)));
  return found.filter((x): x is FetchedExtract => x != null);
}

const SYSTEM = `You are a research librarian for Theos Logos. You fetch, verify, and organize. You do not own the theology.

Rules:
- Return JSON only: {"cards":[{voice,work,tradition,quote,note,citation,paraphrased,url}],"caution":string}
- tradition must be one of: patristic, reformed, lutheran, catholic, orthodox, confession
- Quote ONLY from the FETCHED EXTRACTS. If a wording is not in an extract, omit that card.
- Never invent a citation or a URL. Use the extract's locus and url.
- paraphrased=false when the quote is taken verbatim (shortened only by ellipsis). paraphrased=true if you compress a sentence from the extract.
- 3 to 4 cards, different voices. Short quotes (1–3 sentences).
- Separate an author's own words from later interpretation. Label interpretation in note.
- No homily. No application. No celebrity pastors.
- If the extracts do not treat the term as subject, return {"cards":[],"caution":"..."}.`;

export function extractsPrompt(extracts: FetchedExtract[], focus: string): string {
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
  return [focus, "", ...blocks].join("\n\n");
}

function cardsFromExtracts(extracts: FetchedExtract[]): SourceCard[] {
  const cards: SourceCard[] = [];
  for (const ex of extracts) {
    const quote = ex.paragraphs[0]?.slice(0, 600);
    if (!quote) continue;
    cards.push({
      voice: ex.entry.voice,
      work: ex.entry.work,
      tradition: ex.entry.tradition,
      quote,
      citation: `${ex.entry.locus} · ${ex.url}`,
      paraphrased: false,
      url: ex.url,
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
}): Promise<{ cards: SourceCard[]; caution: string } | null> {
  const extracts = await retrieveExtracts(opts);
  if (!extracts.length) return null;

  if (geminiApiKey()) {
    try {
      const text = await generateGeminiJson({
        system: SYSTEM,
        user: extractsPrompt(extracts, opts.focus),
        maxOutputTokens: 1600,
      });
      const cards = parseRetrieved(text);
      if (cards.length) return { cards, caution: RETRIEVAL_CAUTION };
    } catch {
      // Fall through to verbatim extracts — never invent from model memory.
    }
  }

  const cards = cardsFromExtracts(extracts);
  if (!cards.length) return null;
  return { cards, caution: RETRIEVAL_CAUTION };
}
