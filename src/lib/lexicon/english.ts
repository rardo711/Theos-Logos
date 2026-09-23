/**
 * English NT lexicon — UBS Greek NT Dictionary (en), CC BY-SA 4.0.
 * Secondary short glosses: canonical NT gap-fills (G1–G5624) are
 * Abbott-Smith 1922 (public domain), verbatim; 20 omissions keep their
 * prior eng.tsv fallback gloss (src "eng-fallback"); extended numbers
 * (G5625+) keep bcv-commons/strongs eng.tsv glosses (src "eng").
 * Committed static JSON — never fetched at Vercel build. Chip tap never Gemini.
 *
 * Sense fidelity: when a verse reference is provided, pick the LEXMeanings
 * entry whose LEXReferences contain that SIL verse (BBBCCCVVV). Fallback: first
 * meaning only if no ref hit.
 *
 * Do NOT reuse STEPBible glosses.json for NT Greek — UBS EN is primary for
 * locale=en NT word chips. OT Hebrew stays STEPBible/BDB.
 */
import englishJson from "./data/english.json" with { type: "json" };
import { referenceToSilVerseKey } from "./spanish.ts";

export { referenceToSilVerseKey };

export const englishAttribution =
  (englishJson as { attribution?: string }).attribution ??
  "UBS Greek NT Dictionary (English) © United Bible Societies. CC BY-SA 4.0.";

export const abbottSmithAttribution =
  "G. Abbott-Smith, A Manual Greek Lexicon of the New Testament (New York: Scribner's, 1922). Public domain.";

type CompactSense = {
  g: string[];
  d: string;
  dom?: string[];
  sub?: string[];
  code?: string;
  /** SIL verse keys BBBCCCVVV from UBS LEXReferences. */
  rv?: string[];
};

type CompactEn = {
  s: string;
  m: string;
  pos?: string[];
  ss: CompactSense[];
  sc?: string[];
  sg?: string;
  src?: "ubs" | "eng" | "abbott-smith" | "eng-fallback";
};

const by = (englishJson as { by: Record<string, CompactEn> }).by ?? {};
const byGloss =
  (englishJson as { byGloss?: Record<string, string[]> }).byGloss ?? {};

export type EnglishSense = {
  glosses: string[];
  definitionShort: string;
  domains: string[];
  subdomains: string[];
  entryCode: string;
  /** True when this sense was selected via LEXReferences for the verse. */
  matchedByReference?: boolean;
};

export type EnglishLexiconResult = {
  word: string;
  strongs: string;
  strongsAll: string[];
  lemma: string;
  pos: string[];
  senses: EnglishSense[];
  /** Index of the sense shown as Sense / Gloss hero. */
  selectedSenseIndex: number;
  /** Hero gloss (first gloss of the selected sense, or eng short). */
  gloss: string;
  glossExtras: string[];
  /** DefinitionShort for “Sense in this verse”. */
  sentido: string;
  domains: string[];
  subdomains: string[];
  /** Quiet meta: UBS LEXEntryCode (e.g. 58.35). */
  entryCode: string;
  /** How many other UBS senses exist beyond the selected one. */
  relatedSenseCount: number;
  shortGloss?: string;
  attribution: string;
  source: "ubs" | "eng" | "abbott-smith";
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
    .replace(/[^a-z]+/g, " ")
    .trim();
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
  e: CompactEn,
  reference?: string,
): EnglishLexiconResult {
  const silKey = referenceToSilVerseKey(reference);
  const { index: selectedSenseIndex, matched } = pickSenseIndex(
    e.ss || [],
    silKey,
  );
  const senses: EnglishSense[] = (e.ss || []).map((s, i) => ({
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
  const source: EnglishLexiconResult["source"] =
    e.src === "abbott-smith"
      ? "abbott-smith"
      : e.src === "eng" || e.src === "eng-fallback"
        ? "eng"
        : "ubs";
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
    attribution:
      e.src === "abbott-smith" ? abbottSmithAttribution : englishAttribution,
    source,
    senseMatchedByReference: matched,
  };
}

export function lookupEnglishByStrongs(
  strongs: string,
  reference?: string,
): EnglishLexiconResult | null {
  const key = normalizeStrongs(strongs);
  if (!key) return null;
  const raw = by[key];
  return raw ? expand(key, raw, reference) : null;
}

export function lookupEnglishByGloss(
  word: string,
  reference?: string,
): EnglishLexiconResult[] {
  const key = glossKey(word);
  if (!key) return [];
  const ids = byGloss[key] ?? [];
  const out: EnglishLexiconResult[] = [];
  for (const id of ids) {
    const hit = lookupEnglishByStrongs(id, reference);
    if (hit) out.push({ ...hit, word });
  }
  return out;
}

/**
 * Prefer a UBS hit whose LEXReferences include this verse; else first gloss hit.
 * Never Gemini. Never STEPBible glosses.json for NT Greek.
 */
export function lookupEnglishWordNow(
  word: string,
  reference?: string,
): EnglishLexiconResult | null {
  const hits = lookupEnglishByGloss(word, reference);
  if (hits.length) {
    const refHit = hits.find((h) => h.senseMatchedByReference);
    if (refHit) return refHit;
    return hits[0];
  }
  if (/^g\s*0*\d+$/i.test(word.trim())) {
    return lookupEnglishByStrongs(word, reference);
  }
  return null;
}

export function hasEnglishLexiconChip(word: string): boolean {
  return lookupEnglishWordNow(word) != null;
}
