import { createServerFn } from "@tanstack/react-start";
import type { LexiconResult } from "../bible/types.ts";
import { lookupWordNow } from "./stepbible.ts";
import {
  lookupSpanishByStrongs,
  lookupSpanishWordNow,
  type SpanishLexiconResult,
} from "./spanish.ts";

export const askLexicon = createServerFn({ method: "POST" })
  .validator(
    (input: {
      word: string;
      reference: string;
      verseText: string;
    }) => input,
  )
  .handler(async ({ data }): Promise<LexiconResult> => {
    const hit = lookupWordNow(data.word, data.reference);
    if (hit) return hit;
    return {
      word: data.word,
      gloss: "No original-language entry is indexed for this English word.",
      range: "",
      citation: "",
      caution:
        "Confirm the lemma and senses in BDAG, BDB, or HALOT before citing.",
    };
  });

/** Spanish UBS gloss lookup by Strong's or Spanish surface gloss. Never Gemini. */
export const askSpanishLexicon = createServerFn({ method: "POST" })
  .validator(
    (input: {
      strongs?: string;
      word?: string;
      reference?: string;
    }) => input,
  )
  .handler(async ({ data }): Promise<SpanishLexiconResult | null> => {
    if (data.strongs) return lookupSpanishByStrongs(data.strongs);
    if (data.word) return lookupSpanishWordNow(data.word, data.reference);
    return null;
  });
