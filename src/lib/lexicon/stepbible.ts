import type { LexiconResult } from "@/lib/bible/types";

export type StepEntry = {
  strongs: string;
  language: "hebrew" | "greek" | "aramaic";
  source: string;
  lemma: string;
  transliteration?: string;
  morphology?: string;
  gloss: string;
  definition: string;
  lsj?: string;
};

type Index = {
  attribution: string;
  byStrongs: Record<string, StepEntry>;
  byGloss: Record<string, string[]>;
};

let cached: Index | null | undefined;

async function loadIndex(): Promise<Index | null> {
  if (cached !== undefined) return cached;
  try {
    const mod = await import("./data/stepbible.json");
    cached = (mod.default ?? mod) as Index;
  } catch {
    cached = null;
  }
  return cached;
}

function glossKey(word: string): string {
  return word.toLowerCase().replace(/[^a-z]+/g, " ").trim();
}

export async function lookupByStrongs(strongs: string): Promise<StepEntry | null> {
  const index = await loadIndex();
  if (!index) return null;
  const key = strongs.toUpperCase().replace(/\s+/g, "");
  return (
    index.byStrongs[key] ??
    index.byStrongs[key.replace(/^([HG])0+/, "$1")] ??
    null
  );
}

export async function lookupByEnglish(word: string): Promise<StepEntry[]> {
  const index = await loadIndex();
  if (!index) return [];
  const key = glossKey(word);
  const ids = index.byGloss[key] ?? [];
  const out: StepEntry[] = [];
  for (const id of ids) {
    const e = index.byStrongs[id];
    if (e) out.push(e);
  }
  return out;
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
    citation: `${entry.source}; ${entry.strongs}. Lexicon data from STEPBible.org (CC BY 4.0).`,
    caution:
      "Retrieved entry, not a generated definition. Confirm in BDAG or HALOT for formal citation.",
  };
}
