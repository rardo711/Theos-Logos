import type { LexiconResult } from "@/lib/bible/types";
import { byGloss as deskGloss, byStrongs as deskStrongs, deskAttribution } from "./data/desk";

export type StepEntry = {
  strongs: string;
  language: "hebrew" | "greek" | "aramaic";
  source: string;
  lemma: string;
  gloss: string;
  definition: string;
};

type Compact = {
  s: string;
  l: "h" | "g";
  m: string;
  g: string;
  d: string;
  src: string;
};

type Index = {
  byStrongs: Record<string, StepEntry>;
  byGloss: Record<string, string[]>;
};

let cached: Index | null | undefined;

function expand(c: Compact): StepEntry {
  return {
    strongs: c.s,
    language: c.l === "h" ? "hebrew" : "greek",
    source: c.src === "BDB" ? "TBESH (abridged BDB)" : "TBESG (Abbott-Smith)",
    lemma: c.m,
    gloss: c.g,
    definition: c.d,
  };
}

function fromDesk(): Index {
  const byStrongs: Record<string, StepEntry> = {};
  for (const [k, v] of Object.entries(deskStrongs)) byStrongs[k] = expand(v);
  return { byStrongs, byGloss: deskGloss };
}

async function loadIndex(): Promise<Index | null> {
  if (cached !== undefined) return cached;
  const desk = fromDesk();
  try {
    const [heb, grk, meta] = await Promise.all([
      import("./data/hebrew.json"),
      import("./data/greek.json"),
      import("./data/glosses.json"),
    ]);
    const byStrongs: Record<string, StepEntry> = { ...desk.byStrongs };
    for (const pack of [heb.default ?? heb, grk.default ?? grk]) {
      for (const [k, v] of Object.entries(pack as Record<string, Compact>)) {
        byStrongs[k] = expand(v);
      }
    }
    const glossFile = (meta.default ?? meta) as { byGloss?: Record<string, string[]> };
    cached = {
      byStrongs,
      byGloss: { ...desk.byGloss, ...(glossFile.byGloss ?? {}) },
    };
  } catch {
    cached = desk;
  }
  return cached;
}

function glossKey(word: string): string {
  return word.toLowerCase().replace(/[^a-z]+/g, " ").trim();
}

function variants(word: string): string[] {
  const key = glossKey(word);
  const out = new Set<string>([key]);
  if (key.endsWith("ies") && key.length > 4) out.add(key.slice(0, -3) + "y");
  if (key.endsWith("es") && key.length > 4) out.add(key.slice(0, -2));
  if (key.endsWith("s") && key.length > 3) out.add(key.slice(0, -1));
  return [...out];
}

export async function lookupByStrongs(strongs: string): Promise<StepEntry | null> {
  const index = await loadIndex();
  if (!index) return null;
  const key = strongs.toUpperCase().replace(/\s+/g, "");
  return index.byStrongs[key] ?? index.byStrongs[key.replace(/^([HG])0+/, "$1")] ?? null;
}

export async function lookupByEnglish(word: string): Promise<StepEntry[]> {
  const index = await loadIndex();
  if (!index) return [];
  const ids: string[] = [];
  for (const key of variants(word)) {
    for (const id of index.byGloss[key] ?? []) {
      if (!ids.includes(id)) ids.push(id);
    }
  }
  return ids.map((id) => index.byStrongs[id]).filter(Boolean) as StepEntry[];
}

export function emptyResult(word: string): LexiconResult {
  return {
    word,
    gloss: `No original-language entry is indexed for “${word}”.`,
    range: "",
    citation: "",
    caution:
      "This English rendering may cover more than one lemma. Try another word in the verse, or confirm in BDB or BDAG.",
    empty: true,
  };
}

export function entryToResult(
  word: string,
  entry: StepEntry,
  sense?: string,
): LexiconResult {
  return {
    word,
    lemma: entry.lemma,
    language: entry.language,
    strongs: entry.strongs,
    gloss: sense?.slice(0, 500) || entry.definition.slice(0, 500) || entry.gloss,
    range: entry.gloss.slice(0, 400),
    citation: `${entry.source}; ${entry.strongs}. ${deskAttribution}`,
    caution: "Retrieved entry. Confirm in BDAG or HALOT for formal citation.",
    empty: false,
  };
}
