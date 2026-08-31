import type { LexiconResult } from "@/lib/bible/types";
import {
  byGloss as deskGloss,
  byStrongs as deskStrongs,
  deskAttribution,
  type Compact,
} from "./data/desk";

export type StepEntry = {
  strongs: string;
  language: "hebrew" | "greek" | "aramaic";
  source: string;
  lemma: string;
  gloss: string;
  definition: string;
};

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

const byStrongs: Record<string, StepEntry> = Object.fromEntries(
  Object.entries(deskStrongs).map(([k, v]) => [k, expand(v)]),
);

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

export function lookupByStrongsSync(strongs: string): StepEntry | null {
  const key = strongs.toUpperCase().replace(/\s+/g, "");
  return byStrongs[key] ?? byStrongs[key.replace(/^([HG])0+/, "$1")] ?? null;
}

export function lookupByEnglishSync(word: string): StepEntry[] {
  const ids: string[] = [];
  for (const key of variants(word)) {
    for (const id of deskGloss[key] ?? []) {
      if (!ids.includes(id)) ids.push(id);
    }
  }
  return ids.map((id) => byStrongs[id]).filter(Boolean);
}

export async function lookupByStrongs(strongs: string): Promise<StepEntry | null> {
  return lookupByStrongsSync(strongs);
}

export async function lookupByEnglish(word: string): Promise<StepEntry[]> {
  return lookupByEnglishSync(word);
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

export function lookupWordNow(word: string, reference?: string): LexiconResult {
  const hits = lookupByEnglishSync(word);
  const ot = reference
    ? /^(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Proverbs|Ecclesiastes|Song|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi)/i.test(
        reference,
      )
    : false;
  const chosen =
    hits.find((e) => (ot ? e.language === "hebrew" : e.language === "greek")) ||
    hits[0];
  return chosen ? entryToResult(word, chosen) : emptyResult(word);
}
