import { createServerFn } from "@tanstack/react-start";
import { geminiApiKey } from "@/lib/ai/gemini";
import type { Locale } from "@/lib/bible/books";
import { t } from "@/lib/i18n";
import { getCurated, findEstablishedSources } from "./curated";
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

    // Rule 1: If user clicks the inquire button without a prompt typed in,
    // the answer MUST be with a source on the specific verse selected.
    if (!question) {
      if (ready && ready.cards.length > 0) {
        if (data.mode === "traditions") {
          return {
            ...ready,
            caution:
              locale === "es"
                ? "Fuentes primarias verificadas por tradiciones para este versículo."
                : "Verified historic primary sources across traditions for this verse.",
          };
        }
        return ready;
      }
    }

    // Rule 2: If someone asks about a specific topic, prioritize returning
    // established primary sources directly connected to the question and verse.
    if (question) {
      const establishedMatch = findEstablishedSources({
        bookId: data.bookId,
        chapter: data.chapter,
        verse: data.verse,
        question,
        mode: data.mode,
        locale,
      });

      if (establishedMatch && establishedMatch.cards.length > 0) {
        return establishedMatch;
      }
    }

    // Rule 3: If no established card directly matched, or broader retrieval is sought,
    // consult the catalog extracts with strict prompt grounding.
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
        ? `Desk already has: ${already.join("; ")}. Return only additional extracts directly answering '${question}'.`
        : "";

    const focus =
      data.mode === "traditions"
        ? `Compare how distinct historic traditions received ${ref} specifically regarding: "${question || "the passage"}". Sourced strictly from the provided extracts.`
        : question
          ? `Direct inquiry regarding ${ref}: "${question}". Return commentary cards ONLY from the extracts that directly answer this inquiry in connection with this verse.`
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
        "MANDATORY: Quote only from extracts that directly address the question and verse. Do not summarize prefaces or table of contents.",
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

    // Fallback: If empty prompt and retrieved had no new cards, return the established verse sources
    if (ready && ready.cards.length > 0) return ready;

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
      caution:
        locale === "es"
          ? `No se encontraron fuentes primarias en el catálogo que respondan directamente a '${question}' para ${ref}. Intente reformular su consulta o seleccionar un versículo relacionado.`
          : `No established historic sources in the desk catalog directly address '${question}' for ${ref}. Try refining your inquiry or selecting a related verse.`,
    };
  });
