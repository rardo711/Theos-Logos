/**
 * Spanish NT lexicon — UBS Greek NT Dictionary (es), CC BY-SA 4.0.
 * Secondary short glosses from bcv-commons/strongs spa.tsv (lexicon|ubs-dict only).
 * Committed static JSON — never fetched at Vercel build. Chip tap never Gemini.
 *
 * Sense fidelity: when a verse reference is provided, pick the LEXMeanings
 * entry whose LEXReferences contain that SIL verse (BBBCCCVVV). Fallback: first
 * meaning only if no ref hit.
 */
import spanishJson from "./data/spanish.json" with { type: "json" };
import { bookIndex, parseReference } from "../bible/books.ts";

export const spanishAttribution =
  (spanishJson as { attribution?: string }).attribution ??
  "UBS Greek NT Dictionary (Spanish) © United Bible Societies. CC BY-SA 4.0.";

type CompactSense = {
  g: string[];
  d: string;
  dom?: string[];
  sub?: string[];
  code?: string;
  /** SIL verse keys BBBCCCVVV from UBS LEXReferences. */
  rv?: string[];
};

type CompactEs = {
  s: string;
  m: string;
  pos?: string[];
  ss: CompactSense[];
  sc?: string[];
  sg?: string;
  src?: "ubs" | "spa";
};

const by = (spanishJson as { by: Record<string, CompactEs> }).by ?? {};
const byGloss =
  (spanishJson as { byGloss?: Record<string, string[]> }).byGloss ?? {};

export type SpanishSense = {
  glosses: string[];
  definitionShort: string;
  domains: string[];
  subdomains: string[];
  entryCode: string;
  /** True when this sense was selected via LEXReferences for the verse. */
  matchedByReference?: boolean;
};

export type SpanishLexiconResult = {
  word: string;
  strongs: string;
  strongsAll: string[];
  lemma: string;
  pos: string[];
  senses: SpanishSense[];
  /** Index of the sense shown as Sentido / Glosa hero. */
  selectedSenseIndex: number;
  /** Hero gloss (first gloss of the selected sense, or spa short). */
  gloss: string;
  glossExtras: string[];
  /** DefinitionShort for “Sentido en este versículo”. */
  sentido: string;
  domains: string[];
  subdomains: string[];
  /** Quiet meta: UBS LEXEntryCode (e.g. 67.65). */
  entryCode: string;
  /** How many other UBS senses exist beyond the selected one. */
  relatedSenseCount: number;
  shortGloss?: string;
  attribution: string;
  source: "ubs" | "spa";
  /** True when selected sense came from a LEXReferences hit. */
  senseMatchedByReference: boolean;
};

function normalizeStrongs(raw: string): string {
  const m = String(raw ?? "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .match(/G0*(\d+)/);
  return m ? `G${m[1]}` : "";
}

function glossKey(word: string): string {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-zñ]+/g, " ")
    .trim();
}

/**
 * Map "Juan 1:1" / "John 1:1" / "Juan 1:1-3" → SIL verse key "043001001".
 * USFM book number = Protestant canonical index (Genesis=1, Matthew=40).
 */
export function referenceToSilVerseKey(reference?: string): string | null {
  if (!reference) return null;
  const raw = reference.trim();
  // Strip trailing range end so parseReference can handle "Juan 1:1-3"
  const single = raw.replace(/(\d+\s*[:.]\s*\d+)\s*-\s*\d+\s*$/, "$1");
  const parsed = parseReference(single);
  if (!parsed?.book || parsed.chapter == null || parsed.verse == null) {
    return null;
  }
  const n = bookIndex(parsed.book.id) + 1;
  if (n < 1) return null;
  const bbb = String(n).padStart(3, "0");
  const ccc = String(parsed.chapter).padStart(3, "0");
  const vvv = String(parsed.verse).padStart(3, "0");
  return `${bbb}${ccc}${vvv}`;
}

function pickSenseIndex(
  senses: CompactSense[],
  silKey: string | null,
): { index: number; matched: boolean } {
  if (silKey) {
    const hit = senses.findIndex((s) => (s.rv || []).includes(silKey));
    if (hit >= 0) return { index: hit, matched: true };
  }
  return { index: 0, matched: false };
}

function expand(
  word: string,
  e: CompactEs,
  reference?: string,
): SpanishLexiconResult {
  const silKey = referenceToSilVerseKey(reference);
  const { index: selectedSenseIndex, matched } = pickSenseIndex(
    e.ss || [],
    silKey,
  );
  const senses: SpanishSense[] = (e.ss || []).map((s, i) => ({
    glosses: s.g || [],
    definitionShort: s.d || "",
    domains: s.dom || [],
    subdomains: s.sub || [],
    entryCode: s.code || "",
    matchedByReference: matched && i === selectedSenseIndex,
  }));
  const selected = senses[selectedSenseIndex] ?? senses[0];
  let gloss = selected?.glosses[0] || e.sg || "";
  const glossExtras = (selected?.glosses || []).slice(1);
  const sentido = selected?.definitionShort || "";
  if (!gloss && e.sg) gloss = e.sg;
  const domains = selected?.domains || [];
  const subdomains = selected?.subdomains || [];
  const entryCode = selected?.entryCode || "";
  const strongsAll = e.sc?.length ? e.sc : [e.s];
  return {
    word,
    strongs: e.s,
    strongsAll,
    lemma: e.m || "",
    pos: e.pos || [],
    senses,
    selectedSenseIndex,
    gloss,
    glossExtras,
    sentido,
    domains,
    subdomains,
    entryCode,
    relatedSenseCount: Math.max(0, senses.length - 1),
    shortGloss: e.sg,
    attribution: spanishAttribution,
    source: e.src === "spa" ? "spa" : "ubs",
    senseMatchedByReference: matched,
  };
}

export function lookupSpanishByStrongs(
  strongs: string,
  reference?: string,
): SpanishLexiconResult | null {
  const key = normalizeStrongs(strongs);
  if (!key) return null;
  const raw = by[key];
  return raw ? expand(key, raw, reference) : null;
}

export function lookupSpanishByGloss(
  word: string,
  reference?: string,
): SpanishLexiconResult[] {
  const key = glossKey(word);
  if (!key) return [];
  const ids = byGloss[key] ?? [];
  const out: SpanishLexiconResult[] = [];
  for (const id of ids) {
    const hit = lookupSpanishByStrongs(id, reference);
    if (hit) out.push({ ...hit, word });
  }
  return out;
}

/**
 * Prefer a UBS hit whose LEXReferences include this verse; else first gloss hit.
 * Never Gemini.
 */
export function lookupSpanishWordNow(
  word: string,
  reference?: string,
): SpanishLexiconResult | null {
  const hits = lookupSpanishByGloss(word, reference);
  if (hits.length) {
    const refHit = hits.find((h) => h.senseMatchedByReference);
    if (refHit) return refHit;
    return hits[0];
  }
  if (/^g\s*0*\d+$/i.test(word.trim())) {
    return lookupSpanishByStrongs(word, reference);
  }
  return null;
}

export function hasSpanishLexiconChip(word: string): boolean {
  return lookupSpanishWordNow(word) != null;
}
