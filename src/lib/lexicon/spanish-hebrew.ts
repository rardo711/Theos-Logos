/**
 * Spanish OT Hebrew lexicon layer — human-compiled Spanish signals for
 * Hebrew Strong's numbers. Committed static JSON — never fetched at build.
 * Chip tap never Gemini. NO machine translation anywhere in this file.
 *
 * Sources (each attributed separately, never mixed):
 *  - glossEs: bcv-data/strongs glosses/spa.tsv, lexicon-method rows only
 *    (CC BY-SA 4.0). Honest label: a GLOSS, never a definition, never
 *    "Strong's en español".
 *  - rv09: Reina-Valera 1909 renderings + counts, human-verified
 *    (RV09 text public domain, 1909).
 *
 * The BDB full entries and the verse-sense one-liner stay in hebrew-bdb.ts
 * (public domain, 1906); the card composes both lookups by Strong's number.
 */
import spanishHebrewJson from "./data/spanish-hebrew.json" with { type: "json" };

export const spanishHebrewAttribution =
  (spanishHebrewJson as { attribution?: string }).attribution ??
  "Spanish glosses: bcv-data/strongs contributors, CC BY-SA 4.0.";

export const rv09Attribution =
  (spanishHebrewJson as { rv09Attribution?: string }).rv09Attribution ??
  "Reina-Valera 1909, public domain.";

/** [rendering, occurrence count], most frequent first. */
type CompactRv09 = [string, number];

type CompactEsHe = {
  s: string;
  /** Provenance markers: "gloss" (bcv-data/strongs) and/or "rv09". */
  src: ("gloss" | "rv09")[];
  /** Human lexicon gloss — a gloss, NOT a definition. May be absent. */
  glossEs?: string;
  /** Top RV09 renderings. May be absent. */
  rv09?: CompactRv09[];
};

// `as unknown as`: TS infers JSON arrays as (string|number)[][], never
// tuples — but the importer writes real [string, number] pairs, so the
// tuple type is the honest one here.
const by = (
  spanishHebrewJson as unknown as { by: Record<string, CompactEsHe> }
).by ?? {};
const byGloss =
  (spanishHebrewJson as { byGloss?: Record<string, string[]> }).byGloss ?? {};

export type Rv09Rendering = {
  rendering: string;
  count: number;
};

export type SpanishHebrewResult = {
  word: string;
  strongs: string;
  /** The human Spanish gloss ("sueño"), "" when the entry has none. */
  glossEs: string;
  /** Top RV09 renderings with counts. */
  rv09: Rv09Rendering[];
  /**
   * Hero text for the card: the Spanish gloss when present, else the top
   * RV09 rendering, else "" (the card then falls back to labeled BDB
   * English — never a blank card).
   */
  hero: string;
  /** How `hero` must be labeled: gloss, RV09 rendering, or none. */
  heroKind: "gloss" | "rv09" | "none";
  /** True when the entry carries at least one Spanish signal. */
  hasSpanishSignal: boolean;
  sources: ("gloss" | "rv09")[];
  attribution: string;
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
    .replace(/[^a-zñ]+/g, " ")
    .trim();
}

function expand(word: string, e: CompactEsHe): SpanishHebrewResult {
  const glossEs = e.glossEs || "";
  const rv09: Rv09Rendering[] = (e.rv09 || []).map(([rendering, count]) => ({
    rendering,
    count,
  }));
  const hero = glossEs || rv09[0]?.rendering || "";
  const heroKind: SpanishHebrewResult["heroKind"] = glossEs
    ? "gloss"
    : rv09.length
      ? "rv09"
      : "none";
  return {
    word,
    strongs: e.s,
    glossEs,
    rv09,
    hero,
    heroKind,
    hasSpanishSignal: (e.src || []).length > 0,
    sources: e.src || [],
    attribution: spanishHebrewAttribution,
  };
}

export function lookupSpanishHebrewByStrongs(
  strongs: string,
): SpanishHebrewResult | null {
  const key = normalizeStrongs(strongs);
  if (!key) return null;
  const raw = by[key];
  return raw ? expand(key, raw) : null;
}

export function lookupSpanishHebrewByGloss(
  word: string,
): SpanishHebrewResult[] {
  const key = glossKey(word);
  if (!key) return [];
  const ids = byGloss[key] ?? [];
  const out: SpanishHebrewResult[] = [];
  for (const id of ids) {
    const hit = lookupSpanishHebrewByStrongs(id);
    if (hit) out.push({ ...hit, word });
  }
  return out;
}

/**
 * Spanish surface word → Strong's entry. Exact gloss-key match (mirrors
 * spanish.ts); no inflection expansion, no Gemini.
 */
export function lookupSpanishHebrewWordNow(
  word: string,
): SpanishHebrewResult | null {
  const hits = lookupSpanishHebrewByGloss(word);
  if (hits.length) {
    // Prefer a hit whose gloss (not just an RV09 rendering) matched.
    return hits.find((h) => h.heroKind === "gloss") ?? hits[0];
  }
  if (/^h\s*0*\d+$/i.test(word.trim())) {
    return lookupSpanishHebrewByStrongs(word);
  }
  return null;
}

export function hasSpanishHebrewChip(word: string): boolean {
  return lookupSpanishHebrewWordNow(word) != null;
}
