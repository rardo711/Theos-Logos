import { createServerFn } from "@tanstack/react-start";
import { geminiApiKey } from "@/lib/ai/gemini";
import type { Locale } from "@/lib/bible/books";
import { t } from "@/lib/i18n";
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
      locale?: Locale;
      haveCards?: Array<{
        voice: string;
        citation: string;
        quote?: string;
        url?: string;
      }>;
    }) => input,
  )
  .handler(async ({ data }): Promise<ReceptionResult> => {
    const locale: Locale = data.locale === "es" ? "es" : "en";
    const question = data.question?.trim() ?? "";
    const ready = getCurated(data.bookId, data.chapter, data.verse);

    if (data.mode === "reception" && !question && ready) return ready;

    const ref =
      data.verse != null
        ? `${data.bookName} ${data.chapter}:${data.verse}`
        : `${data.bookName} ${data.chapter}`;

    const langLine =
      locale === "es"
        ? "Write notes and caution in Spanish. Keep quotations in the source language of the extract."
        : "";

    const have = data.haveCards ?? [];
    const excludeUrls = have
      .map((c) => c.url)
      .filter((u): u is string => Boolean(u));
    const already = [...new Set(have.map((c) => c.voice).filter(Boolean))];
    const alreadyLine =
      question && already.length
        ? `Desk already has: ${already.join("; ")}. Return only additional extracts, not a restatement of those cards.`
        : "";

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
      locale,
      excludeUrls,
      focus: [
        focus,
        alreadyLine,
        data.verseText ? `Verse: ${data.verseText}` : "",
        "Quote only from the extracts. Skip passing mentions.",
        langLine,
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
        caution: t(locale, "cautionNoKey"),
      };
    }

    return {
      source: "generated",
      cards: [],
      caution: t(locale, "cautionNoPage"),
    };
  });
