import { createServerFn } from "@tanstack/react-start";
import { geminiApiKey } from "@/lib/ai/gemini";
import { getCurated } from "./curated";
import { assembleFromSources } from "./retrieve";
import type { ReceptionResult } from "@/lib/bible/types";

export const askReception = createServerFn({ method: "POST" })
  .validator(
    (input: {
      bookId: string;
      bookName: string;
      chapter: number;
      verse: number | null;
      verseText: string;
      passage: string;
      question?: string;
      mode: "reception" | "traditions";
    }) => input,
  )
  .handler(async ({ data }): Promise<ReceptionResult> => {
    const question = data.question?.trim() ?? "";
    const ready = getCurated(data.bookId, data.chapter, data.verse);

    if (data.mode === "reception" && !question && ready) return ready;

    const ref =
      data.verse != null
        ? `${data.bookName} ${data.chapter}:${data.verse}`
        : `${data.bookName} ${data.chapter}`;

    const focus =
      data.mode === "traditions"
        ? `Compare how distinct historic traditions received ${ref}. Include at least one patristic, one Reformation (reformed or lutheran), and one catholic or orthodox voice. Fair, sourced, not polemical.`
        : question
          ? `Gather ADDITIONAL historic voices aimed at: ${question}. Do not repeat a generic Augustine/Chrysostom/Calvin/Westminster stack unless a quote uniquely answers the question.`
          : `Gather the historic reception of ${ref}.`;

    const retrieved = await assembleFromSources({
      question,
      bookId: data.bookId,
      chapter: data.chapter,
      verseText: data.verseText,
      mode: data.mode,
      focus: [
        focus,
        data.verseText ? `Verse: ${data.verseText}` : "",
        "Quote only from the extracts. Skip passing mentions.",
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (retrieved?.cards.length) {
      return {
        source: "generated",
        cards: retrieved.cards,
        caution: retrieved.caution,
      };
    }

    if (ready && !question) return ready;

    if (!geminiApiKey()) {
      return {
        source: "generated",
        cards: [],
        caution:
          "No fetched page matched this focus, and Inquire has no Gemini key. Desk notes still work.",
      };
    }

    return {
      source: "generated",
      cards: [],
      caution:
        "No public page in the committed index treated this as its subject. The librarian does not quote from memory.",
    };
  });
