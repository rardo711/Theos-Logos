import { createServerFn } from "@tanstack/react-start";
import { geminiApiKey } from "@/lib/ai/gemini";
import type { Locale } from "@/lib/bible/books";
import { t } from "@/lib/i18n";
import { getCurated, findEstablishedSources } from "./curated";
import { assembleFromSources } from "./retrieve";
import { attachWeakNtCatalog } from "./catalog-weak-nt";
import { additionalSourceCards } from "./notes";
import { synthesizeFromDesk } from "./synthesize";
import { orientForVerse } from "./orient";
import { formatReference } from "@/lib/bible/reference";
import type { ReceptionResult, SourceCard } from "@/lib/bible/types";

attachWeakNtCatalog();

type AskInput = {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number | null;
  /** End of a contiguous selection. null for a single verse. */
  verseEnd?: number | null;
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
};

function refOf(data: AskInput): string {
  return formatReference(data.bookName, data.chapter, data.verse, data.verseEnd);
}

/**
 * Attaches orientation to a result the desk could not source. Only fires on an
 * empty card set: with even one fetched quotation on the desk the reader has a
 * primary source in front of them, and orientation would compete with it.
 */
async function withOrientation(
  result: ReceptionResult,
  data: AskInput,
  question: string,
): Promise<ReceptionResult> {
  if (result.cards.length) return result;
  const orientation = await orientForVerse({
    reference: refOf(data),
    verseText: data.verseText,
    question,
    locale: data.locale === "es" ? "es" : "en",
  });
  return orientation ? { ...result, orientation } : result;
}

async function retrieveForVerse(
  data: AskInput,
  question: string,
): Promise<ReceptionResult | null> {
  attachWeakNtCatalog();
  const locale: Locale = data.locale === "es" ? "es" : "en";
  const ref = refOf(data);
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
    already.length
      ? `Desk already has: ${already.join("; ")}. Return only additional extracts.`
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
    verse: data.verse,
    verseEnd: data.verseEnd,
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

  if (!retrieved?.cards.length) {
    console.warn(`[reception] no cards assembled for ${ref}`);
    return null;
  }
  return {
    source: "generated",
    cards: retrieved.cards.map((c) => ({ ...c, source: "generated" as const })),
    caution: retrieved.caution,
  };
}

export const askReception = createServerFn({ method: "POST" })
  .validator((input: AskInput) => input)
  .handler(async ({ data }): Promise<ReceptionResult> => {
    const locale: Locale = data.locale === "es" ? "es" : "en";
    const question = data.question?.trim() ?? "";
    const ready = getCurated(data.bookId, data.chapter, data.verse, data.verseEnd);

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

    const retrieved = await retrieveForVerse(data, question);
    if (retrieved?.cards.length) return retrieved;

    if (ready && ready.cards.length > 0) return ready;

    if (!geminiApiKey()) {
      return {
        source: "generated",
        cards: [],
        caution: t(locale, "cautionNoKey"),
      };
    }

    const ref = refOf(data);
    return withOrientation(
      {
        source: "generated",
        cards: [],
        caution:
          locale === "es"
            ? `No se encontraron fuentes primarias en el catálogo que respondan directamente a '${question}' para ${ref}. Intente reformular su consulta o seleccionar un versículo relacionado.`
            : `No established historic sources in the desk catalog directly address '${question}' for ${ref}. Try refining your inquiry or selecting a related verse.`,
      },
      data,
      question,
    );
  });

/** Retrieval only: curated cards plus catalog extracts for this verse. */
export const gatherCommentaries = createServerFn({ method: "POST" })
  .validator((input: AskInput) => input)
  .handler(async ({ data }): Promise<ReceptionResult> => {
    attachWeakNtCatalog();
    const locale: Locale = data.locale === "es" ? "es" : "en";
    const ready = getCurated(data.bookId, data.chapter, data.verse, data.verseEnd);
    const retrieved = await retrieveForVerse(
      {
        ...data,
        question: undefined,
        haveCards:
          data.haveCards ??
          ready?.cards.map((c) => ({
            voice: c.voice,
            citation: c.citation,
            quote: c.quote,
            url: c.url,
          })),
      },
      "",
    );

    const prior = ready?.cards ?? [];
    const added = retrieved?.cards.length
      ? additionalSourceCards(prior, retrieved.cards)
      : [];
    const cards = [...prior, ...added];

    if (cards.length) {
      return {
        source: added.length ? "generated" : "curated",
        cards,
        caution: added.length
          ? retrieved?.caution
          : locale === "es"
            ? "Fuentes primarias verificadas para este versículo."
            : "Verified historic primary sources for this verse.",
      };
    }

    if (!geminiApiKey()) {
      return {
        source: "generated",
        cards: [],
        caution: t(locale, "cautionNoKey"),
      };
    }

    return withOrientation(
      {
        source: "generated",
        cards: [],
        caution:
          locale === "es"
            ? `No hay comentarios históricos indexados todavía para ${refOf(data)}.`
            : `No indexed historic commentaries yet for ${refOf(data)}.`,
      },
      data,
      "",
    );
  });

export const synthesizeFromCards = createServerFn({ method: "POST" })
  .validator(
    (input: {
      bookName: string;
      chapter: number;
      verse: number | null;
      verseEnd?: number | null;
      verseText: string;
      question?: string;
      locale?: Locale;
      cards: SourceCard[];
    }) => input,
  )
  .handler(async ({ data }) => {
    const locale: Locale = data.locale === "es" ? "es" : "en";
    const reference = formatReference(
      data.bookName,
      data.chapter,
      data.verse,
      data.verseEnd,
    );
    return synthesizeFromDesk({
      reference,
      verseText: data.verseText,
      question: data.question ?? "",
      cards: data.cards ?? [],
      locale,
    });
  });
