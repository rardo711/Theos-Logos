/**
 * Spanish NT lexicon — UBS Greek NT Dictionary (es), CC BY-SA 4.0.
 * Secondary short glosses from bcv-commons/strongs spa.tsv (lexicon|ubs-dict only).
 * Committed static JSON — never fetched at Vercel build. Chip tap never Gemini.
 */
import spanishJson from "./data/spanish.json" with { type: "json" };

export const spanishAttribution =
  (spanishJson as { attribution?: string }).attribution ??
  "UBS Greek NT Dictionary (Spanish) © United Bible Societies. CC BY-SA 4.0.";

type CompactSense = {
  g: string[];
  d: string;
  dom?: string[];
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
};

export type SpanishLexiconResult = {
  word: string;
  strongs: string;
  strongsAll: string[];
  lemma: string;
  pos: string[];
  senses: SpanishSense[];
  /** Hero gloss (first of first sense, or spa short). */
  gloss: string;
  glossExtras: string[];
  /** DefinitionShort for “Sentido en este versículo”. */
  sentido: string;
  domains: string[];
  shortGloss?: string;
  attribution: string;
  source: "ubs" | "spa";
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

function expand(word: string, e: CompactEs): SpanishLexiconResult {
  const senses: SpanishSense[] = (e.ss || []).map((s) => ({
    glosses: s.g || [],
    definitionShort: s.d || "",
    domains: s.dom || [],
  }));
  const first = senses[0];
  let gloss = first?.glosses[0] || e.sg || "";
  let glossExtras = (first?.glosses || []).slice(1);
  let sentido = first?.definitionShort || "";
  // spa short as hero only when UBS left gloss empty
  if (!gloss && e.sg) gloss = e.sg;
  const domains = first?.domains || [];
  const strongsAll = e.sc?.length ? e.sc : [e.s];
  return {
    word,
    strongs: e.s,
    strongsAll,
    lemma: e.m || "",
    pos: e.pos || [],
    senses,
    gloss,
    glossExtras,
    sentido,
    domains,
    shortGloss: e.sg,
    attribution: spanishAttribution,
    source: e.src === "spa" ? "spa" : "ubs",
  };
}

export function lookupSpanishByStrongs(
  strongs: string,
): SpanishLexiconResult | null {
  const key = normalizeStrongs(strongs);
  if (!key) return null;
  const raw = by[key];
  return raw ? expand(key, raw) : null;
}

export function lookupSpanishByGloss(word: string): SpanishLexiconResult[] {
  const key = glossKey(word);
  if (!key) return [];
  const ids = byGloss[key] ?? [];
  const out: SpanishLexiconResult[] = [];
  for (const id of ids) {
    const hit = lookupSpanishByStrongs(id);
    if (hit) out.push({ ...hit, word });
  }
  return out;
}

/** Prefer first UBS hit for a Spanish surface gloss; never Gemini. */
export function lookupSpanishWordNow(
  word: string,
  _reference?: string,
): SpanishLexiconResult | null {
  const hits = lookupSpanishByGloss(word);
  if (hits[0]) return hits[0];
  // Direct Strong’s paste (G3056 / g3056)
  if (/^g\s*0*\d+$/i.test(word.trim())) {
    return lookupSpanishByStrongs(word);
  }
  return null;
}

export function hasSpanishLexiconChip(word: string): boolean {
  return lookupSpanishWordNow(word) != null;
}
