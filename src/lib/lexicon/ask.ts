import { createServerFn } from "@tanstack/react-start";
import { geminiApiKey, generateGeminiJson } from "@/lib/ai/gemini";
import type { LexiconResult } from "@/lib/bible/types";
import { getLocalLexicon } from "./local";
import {
  emptyResult,
  entryToResult,
  lookupByEnglish,
  lookupByStrongs,
  type StepEntry,
} from "./stepbible";

const SYSTEM = `You do not invent lexicon definitions.
You receive one or more retrieved STEPBible entries (BDB / Abbott-Smith).
JSON only: {"strongs","sense"}
- strongs: copy the Strong's number of the entry that best fits THIS verse. Never invent a number.
- sense: one or two sentences on how that retrieved meaning lands in the verse. Do not add senses absent from the entry.
- If none fit, pick the closest retrieved entry and keep sense cautious.`;

async function pickEntry(word: string, reference: string): Promise<StepEntry[]> {
  const asStrongs = word.toUpperCase().replace(/\s+/g, "");
  if (/^[HG]\d+$/.test(asStrongs)) {
    const hit = await lookupByStrongs(asStrongs);
    return hit ? [hit] : [];
  }
  const ot =
    /^(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Proverbs|Ecclesiastes|Song|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi)/i.test(
      reference,
    );
  const hits = await lookupByEnglish(word);
  return hits.filter((e) => (ot ? e.language === "hebrew" : true));
}

export const askLexicon = createServerFn({ method: "POST" })
  .validator(
    (input: { word: string; reference: string; verseText: string }) => input,
  )
  .handler(async ({ data }): Promise<LexiconResult> => {
    const retrieved = await pickEntry(data.word, data.reference);
    const local = getLocalLexicon(data.word, data.reference);

    if (!retrieved.length) {
      return local ?? emptyResult(data.word);
    }

    if (!geminiApiKey()) {
      return entryToResult(data.word, retrieved[0]);
    }

    const packet = retrieved.slice(0, 6).map((e) => ({
      strongs: e.strongs,
      lemma: e.lemma,
      gloss: e.gloss,
      definition: e.definition.slice(0, 400),
      source: e.source,
    }));

    try {
      const raw = await generateGeminiJson({
        system: SYSTEM,
        user: `Word: "${data.word}"\nReference: ${data.reference}\nVerse: ${data.verseText}\nRetrieved entries:\n${JSON.stringify(packet)}`,
        temperature: 0.1,
        maxOutputTokens: 400,
      });
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start >= 0 && end > start) {
        const parsed = JSON.parse(raw.slice(start, end + 1)) as {
          strongs?: string;
          sense?: string;
        };
        const chosen =
          (parsed.strongs && (await lookupByStrongs(String(parsed.strongs)))) ||
          retrieved[0];
        if (chosen) return entryToResult(data.word, chosen, parsed.sense);
      }
    } catch {
      /* fall through to retrieved entry */
    }
    return entryToResult(data.word, retrieved[0]);
  });
