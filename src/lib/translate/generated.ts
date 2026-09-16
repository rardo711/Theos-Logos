/**
 * Translate Reception card bodies (generated + curated/catalog) EN→ES via NMT.
 * Voice / work / citation stay for i18n-sources localizeCard (notranslate extras).
 * Scripture prefers verseTextEs when the quote is the English verse.
 */
import type { Locale } from "../bible/books.ts";
import type {
  DeskSynthesis,
  ReceptionResult,
  SourceCard,
} from "../bible/types.ts";
import { longQuotedSpans } from "../reception/quoted.ts";
import { getCachedTranslation, saveCachedTranslation } from "./cache.ts";
import { TRANSLATE_ENGINE, translateConfigured } from "./engine.ts";
import { googleTranslateHtml } from "./google-nmt.ts";
import {
  isPrimarilyScripture,
  protectForTranslate,
  unwrapProtected,
} from "./protect.ts";
import { localizeBookNamesInBody } from "../i18n-sources.ts";

const ATTRIBUTABLE_QUOTE = 24;

export type TranslateGeneratedOpts = {
  locale: Locale;
  /** English verse text for the desk (to detect scripture-only quotes). */
  verseTextEn?: string;
  /** Spanish scripture already on the desk — preferred over NMT for verse display. */
  verseTextEs?: string;
};

async function translateOne(
  text: string,
  targetLocale: string,
  extras: string[],
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const cached = await getCachedTranslation({
    text: trimmed,
    engine: TRANSLATE_ENGINE,
    targetLocale,
  });
  if (cached != null) return cached;

  const { html } = protectForTranslate(trimmed, extras);
  const out = await googleTranslateHtml({
    htmlParts: [html],
    source: "en",
    target: targetLocale,
  });
  if (!out?.[0]) return text;
  const plain = unwrapProtected(out[0]);
  if (!plain.trim()) return text;
  await saveCachedTranslation({
    text: trimmed,
    translated: plain,
    engine: TRANSLATE_ENGINE,
    targetLocale,
    sourceLocale: "en",
  });
  return plain;
}

/**
 * Translate quote / note / contextBridge on any Reception card (generated or
 * curated/catalog). Voice, work, citation stay for i18n-sources localizeCard.
 */
function withEsBookNames(card: SourceCard): SourceCard {
  return {
    ...card,
    quote: localizeBookNamesInBody(card.quote, "es"),
    contextBridge: card.contextBridge
      ? localizeBookNamesInBody(card.contextBridge, "es")
      : card.contextBridge,
    note: card.note ? localizeBookNamesInBody(card.note, "es") : card.note,
  };
}

export async function translateGeneratedCard(
  card: SourceCard,
  opts: TranslateGeneratedOpts,
): Promise<SourceCard> {
  if (opts.locale !== "es") return card;
  // Even without NMT credentials, still rewrite EN book names in refs.
  if (!translateConfigured()) return withEsBookNames(card);

  const extras = [card.voice, card.work, card.citation].filter(Boolean);

  let quote = card.quote;
  if (
    opts.verseTextEs &&
    isPrimarilyScripture(card.quote, opts.verseTextEn)
  ) {
    quote = opts.verseTextEs;
  } else if (card.quote) {
    quote = await translateOne(card.quote, "es", extras);
  }

  const contextBridge = card.contextBridge
    ? await translateOne(card.contextBridge, "es", extras)
    : card.contextBridge;
  const note =
    card.note && card.note !== card.contextBridge
      ? await translateOne(card.note, "es", extras)
      : contextBridge && card.note === card.contextBridge
        ? contextBridge
        : card.note
          ? await translateOne(card.note, "es", extras)
          : card.note;

  // NMT protect leaves English verse refs intact; localize book names for ES.
  return {
    ...card,
    quote: localizeBookNamesInBody(quote, "es"),
    contextBridge: contextBridge
      ? localizeBookNamesInBody(contextBridge, "es")
      : contextBridge,
    note: note ? localizeBookNamesInBody(note, "es") : note,
  };
}

export async function translateGeneratedCards(
  cards: SourceCard[],
  opts: TranslateGeneratedOpts,
): Promise<SourceCard[]> {
  if (opts.locale !== "es") return cards;
  if (!translateConfigured()) {
    console.warn(
      "[translate] credentials missing — returning English card text with ES book names",
    );
    return cards.map(withEsBookNames);
  }
  const out: SourceCard[] = [];
  for (const c of cards) {
    out.push(await translateGeneratedCard(c, opts));
  }
  return out;
}

/**
 * Translate long English quoted spans inside an already-Spanish synthesis
 * answer so Spanish readers can understand card quotations embedded in prose.
 */
export async function translateSynthesisQuotes(
  synthesis: DeskSynthesis,
  opts: TranslateGeneratedOpts,
): Promise<DeskSynthesis> {
  if (opts.locale !== "es" || !synthesis.answer) return synthesis;
  if (!translateConfigured()) {
    return {
      ...synthesis,
      answer: localizeBookNamesInBody(synthesis.answer, "es"),
    };
  }

  const spans = longQuotedSpans(synthesis.answer, ATTRIBUTABLE_QUOTE);
  if (!spans.length) return synthesis;

  let answer = synthesis.answer;
  // Longest first so nested/overlapping replacements stay stable.
  const unique = [...new Set(spans)].sort((a, b) => b.length - a.length);
  for (const span of unique) {
    if (opts.verseTextEs && isPrimarilyScripture(span, opts.verseTextEn)) {
      answer = answer.split(span).join(opts.verseTextEs);
      continue;
    }
    // Skip spans that already look mostly Spanish (accented vowels / ¿¡).
    if (/[áéíóúñü¿¡]/i.test(span) && !/[A-Za-z]{4,}/.test(span.replace(/[áéíóúñü]/gi, ""))) {
      continue;
    }
    const translated = await translateOne(span, "es", synthesis.cited);
    if (translated && translated !== span) {
      answer = answer.split(span).join(translated);
    }
  }
  return { ...synthesis, answer: localizeBookNamesInBody(answer, "es") };
}

/**
 * Apply NMT to a reception payload: all card bodies (+ optional synthesis).
 * Empty results and locale≠es pass through unchanged.
 * Display selection must follow the request locale — callers must not reuse an
 * ES-translated payload when the app locale switches back to English.
 */
export async function translateGeneratedReception(
  result: ReceptionResult,
  opts: TranslateGeneratedOpts,
): Promise<ReceptionResult> {
  if (opts.locale !== "es") return result;

  const cards = await translateGeneratedCards(result.cards, opts);
  let synthesis = result.synthesis;
  if (synthesis) {
    synthesis = await translateSynthesisQuotes(synthesis, opts);
  }
  return {
    ...result,
    cards,
    synthesis,
  };
}
