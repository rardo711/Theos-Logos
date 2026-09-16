/**
 * Hebrew lexicon — Brown-Driver-Briggs (1906), public domain.
 * Committed static JSON — never fetched at build. Card taps never call Gemini.
 *
 * Sense fidelity: when a verse reference is provided, pick the BDB sense block
 * whose parsed <ref> tags include that SIL verse (BBBCCCVVV). Fallback: the
 * head block (index 0). Mirrors english.ts.
 */
import hebrewBdbJson from "./data/hebrew-bdb.json" with { type: "json" };
import { referenceToSilVerseKey } from "./spanish.ts";

export const hebrewBdbAttribution =
  (hebrewBdbJson as { attribution?: string }).attribution ??
  "Brown-Driver-Briggs Hebrew and English Lexicon (1906), public domain.";

/** One BDB sense block, verbatim wording (markup stripped at import). */
type CompactBdbSense = {
  /** Full sense text, verbatim BDB. */
  t: string;
  /** Highlighted English glosses inside the block. */
  g: string[];
  /** SIL verse keys BBBCCCVVV parsed from the block's <ref> tags. */
  rv?: string[];
};

type CompactBdb = {
  s: string;
  /** Winning source CSV row id, e.g. "BDB430" (traceability for audits). */
  row: string;
  /** Hebrew (or Aramaic) headword. */
  m: string;
  pos?: string[];
  /** Occurrence count as printed by BDB. */
  occ?: number;
  /** BDB's highlighted headword gloss, e.g. "beginning, chief". */
  hw?: string;
  lang?: "aramaic";
  ss: CompactBdbSense[];
};

const by = (hebrewBdbJson as { by: Record<string, CompactBdb> }).by ?? {};
const byGloss =
  (hebrewBdbJson as { byGloss?: Record<string, string[]> }).byGloss ?? {};

export type HebrewBdbSense = {
  /** Verbatim BDB sense text (first block is the entry head). */
  text: string;
  glosses: string[];
  refs: string[];
  /** True when this sense was selected via <ref> tags for the verse. */
  matchedByReference?: boolean;
};

export type HebrewBdbResult = {
  word: string;
  strongs: string;
  lemma: string;
  pos: string[];
  occurrences?: number;
  /** BDB's own highlighted headword gloss (may be empty). */
  headwordGloss: string;
  senses: HebrewBdbSense[];
  /** Index of the sense shown as "Sense in this verse". */
  selectedSenseIndex: number;
  /**
   * Hero "meaning": headword gloss, else the selected sense's first gloss,
   * else the lemma itself (proper names usually have no gloss).
   */
  gloss: string;
  glossExtras: string[];
  /** Selected sense's full verbatim text. */
  sense: string;
  /** How many other BDB sense blocks exist beyond the selected one. */
  relatedSenseCount: number;
  isAramaic: boolean;
  attribution: string;
  /** True when the selected sense came from a <ref> verse hit. */
  senseMatchedByReference: boolean;
};

/** Accept "H430", "h430", "H0430". */
function normalizeStrongs(raw: string): string {
  const m = String(raw ?? "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .match(/H0*(\d+)/);
  return m ? `H${m[1]}` : "";
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
  senses: CompactBdbSense[],
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
  e: CompactBdb,
  reference?: string,
): HebrewBdbResult {
  const silKey = referenceToSilVerseKey(reference);
  const senses: HebrewBdbSense[] = (e.ss || []).map((s) => ({
    text: s.t || "",
    glosses: s.g || [],
    refs: s.rv || [],
  }));
  const { index: selectedSenseIndex, matched } = pickSenseIndex(
    e.ss || [],
    silKey,
  );
  if (matched) senses[selectedSenseIndex].matchedByReference = true;
  const selected = senses[selectedSenseIndex] ?? senses[0];
  const headwordGloss = e.hw || "";
  // Hero meaning: BDB's headword gloss wins; then the selected sense's own
  // glosses; then the bare lemma (names rarely carry a gloss).
  const gloss =
    headwordGloss ||
    selected?.glosses[0] ||
    e.m ||
    "";
  const glossExtras = (selected?.glosses || []).filter((g) => g !== gloss);
  return {
    word,
    strongs: e.s,
    lemma: e.m || "",
    pos: e.pos || [],
    occurrences: e.occ,
    headwordGloss,
    senses,
    selectedSenseIndex,
    gloss,
    glossExtras,
    sense: selected?.text || "",
    relatedSenseCount: Math.max(0, senses.length - 1),
    isAramaic: e.lang === "aramaic",
    attribution: hebrewBdbAttribution,
    senseMatchedByReference: matched,
  };
}

export function lookupHebrewBdbByStrongs(
  strongs: string,
  reference?: string,
): HebrewBdbResult | null {
  const key = normalizeStrongs(strongs);
  if (!key) return null;
  const raw = by[key];
  return raw ? expand(key, raw, reference) : null;
}

export function lookupHebrewBdbByGloss(
  word: string,
  reference?: string,
): HebrewBdbResult[] {
  const key = glossKey(word);
  if (!key) return [];
  const ids = byGloss[key] ?? [];
  const out: HebrewBdbResult[] = [];
  for (const id of ids) {
    const hit = lookupHebrewBdbByStrongs(id, reference);
    if (hit) out.push({ ...hit, word });
  }
  return out;
}

/**
 * Prefer a BDB hit whose <ref> tags include this verse; else first gloss hit.
 * Never Gemini. Hebrew (and Biblical Aramaic) only.
 */
export function lookupHebrewBdbWordNow(
  word: string,
  reference?: string,
): HebrewBdbResult | null {
  const hits = lookupHebrewBdbByGloss(word, reference);
  if (hits.length) {
    const refHit = hits.find((h) => h.senseMatchedByReference);
    if (refHit) return refHit;
    return hits[0];
  }
  if (/^h\s*0*\d+$/i.test(word.trim())) {
    return lookupHebrewBdbByStrongs(word, reference);
  }
  return null;
}

export function hasHebrewBdbChip(word: string): boolean {
  return lookupHebrewBdbWordNow(word) != null;
}
