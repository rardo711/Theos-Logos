import type { LexiconResult } from "../bible/types.ts";
import { getLocalLexicon } from "./local.ts";
import {
  byGloss as deskGloss,
  byStrongs as deskStrongs,
  deskAttribution,
  type Compact,
} from "./data/desk.ts";
import hebrewJson from "./data/hebrew.json";
import greekJson from "./data/greek.json";
import glossesJson from "./data/glosses.json";

export type StepEntry = {
  strongs: string;
  language: "hebrew" | "greek";
  source: "AS" | "BDB";
  lemma: string;
  gloss: string;
  definition: string;
};

const CAUTION =
  "Confirm the lemma and senses in BDAG, BDB, or HALOT before citing.";

type JsonCompact = {
  s: string;
  l: "h" | "g";
  m: string;
  g: string;
  d: string;
  src: string;
};

const hebrew = hebrewJson as Record<string, JsonCompact>;
const greek = greekJson as Record<string, JsonCompact>;
const fullGloss =
  (glossesJson as { byGloss?: Record<string, string[]> }).byGloss ?? {};

function expand(c: Compact | JsonCompact): StepEntry {
  return {
    strongs: c.s,
    language: c.l === "h" ? "hebrew" : "greek",
    source: c.src === "BDB" ? "BDB" : "AS",
    lemma: c.m,
    gloss: c.g,
    definition: c.d,
  };
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

export function isOtReference(reference?: string): boolean {
  if (!reference) return false;
  return /^(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Proverbs|Ecclesiastes|Song|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi)/i.test(
    reference,
  );
}

export function lookupByStrongsSync(strongs: string): StepEntry | null {
  const key = strongs.toUpperCase().replace(/\s+/g, "");
  const alt = key.replace(/^([HG])0+/, "$1");
  const desk = deskStrongs[key] ?? deskStrongs[alt];
  if (desk) return expand(desk);
  const raw = hebrew[key] ?? hebrew[alt] ?? greek[key] ?? greek[alt] ?? null;
  return raw ? expand(raw) : null;
}

export function lookupByEnglishSync(word: string): StepEntry[] {
  const ids: string[] = [];
  for (const key of variants(word)) {
    for (const id of [...(deskGloss[key] ?? []), ...(fullGloss[key] ?? [])]) {
      if (!ids.includes(id)) ids.push(id);
    }
  }
  return ids
    .map((id) => lookupByStrongsSync(id))
    .filter((e): e is StepEntry => e != null);
}

export function entryToResult(word: string, entry: StepEntry): LexiconResult {
  return {
    word,
    lemma: entry.lemma,
    language: entry.language,
    strongs: entry.strongs,
    source: entry.source,
    gloss: entry.definition.slice(0, 500) || entry.gloss,
    range: entry.gloss.slice(0, 400),
    citation: `${entry.source}; ${entry.strongs}. ${deskAttribution}`,
    caution: CAUTION,
  };
}

/** Local note, then desk pocket, then committed STEPBible JSON. Never Gemini. */
export function lookupWordNow(
  word: string,
  reference?: string,
): LexiconResult | null {
  const local = getLocalLexicon(word, reference);
  if (local) return local;

  const hits = lookupByEnglishSync(word);
  const ot = isOtReference(reference);
  const chosen =
    hits.find((e) => (ot ? e.language === "hebrew" : e.language === "greek")) ||
    hits[0];
  return chosen ? entryToResult(word, chosen) : null;
}

export function hasLexiconChip(word: string, reference?: string): boolean {
  return lookupWordNow(word, reference) != null;
}
