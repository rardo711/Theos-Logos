import { createServerFn } from "@tanstack/react-start";
import type { LexiconResult } from "../bible/types.ts";
import { lookupWordNow } from "./stepbible.ts";

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
