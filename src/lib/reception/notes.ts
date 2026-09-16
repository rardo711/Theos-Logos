import type { Locale } from "@/lib/bible/books";
import type { ReceptionResult, SourceCard } from "@/lib/bible/types";
import {
  cachedBookIds,
  cachedChapters,
  cachedVerses,
  clearChapterCached,
  getCached,
  removeCached,
  removeCachedAllLocales,
  saveCached,
} from "./cache.ts";
import {
  curatedBookIds,
  getCurated,
  getCuratedCardsForVerse,
  hasCurated,
  markedChapters as curatedChapters,
  markedVerses as curatedMarked,
} from "./curated.ts";


function citeKey(c: SourceCard): string {
  return `${c.voice}\0${c.citation}`;
}

function quoteKey(c: SourceCard): string {
  return c.quote.replace(/\s+/g, " ").trim().toLowerCase();
}

/** Cards from a focused Inquire that are not already on the desk. */
export function additionalSourceCards(
  prior: SourceCard[],
  incoming: SourceCard[],
): SourceCard[] {
  const seenCite = new Set(prior.map(citeKey));
  const seenQuote = new Set(prior.map(quoteKey));
  const added: SourceCard[] = [];
  for (const c of incoming) {
    const cite = citeKey(c);
    const quote = quoteKey(c);
    if (seenCite.has(cite) || seenQuote.has(quote)) continue;
    seenCite.add(cite);
    seenQuote.add(quote);
    added.push({
      ...c,
      source: c.source ?? "generated",
    });
  }
  return added;
}

/**
 * Merge a server desk into the open desk. Same voice+citation prefers the
 * incoming card so ES NMT can replace English curated quote bodies that were
 * shown from client getCurated before the server round-trip.
 */
export function mergeReceptionCards(
  prior: SourceCard[],
  incoming: SourceCard[],
): { cards: SourceCard[]; addedCount: number } {
  if (!prior.length) {
    return {
      cards: incoming.map((c) => ({ ...c, source: c.source ?? "generated" })),
      addedCount: incoming.length,
    };
  }
  if (!incoming.length) {
    return { cards: prior, addedCount: 0 };
  }

  const priorByCite = new Map(prior.map((c) => [citeKey(c), c]));
  const priorQuotes = new Set(prior.map(quoteKey));

  const cards = prior.map((c) => {
    const newer = incoming.find((i) => citeKey(i) === citeKey(c));
    return newer ?? c;
  });

  const added: SourceCard[] = [];
  for (const c of incoming) {
    if (priorByCite.has(citeKey(c))) continue;
    if (priorQuotes.has(quoteKey(c))) continue;
    added.push({
      ...c,
      source: c.source ?? "generated",
    });
  }

  return { cards: [...cards, ...added], addedCount: added.length };
}

/** True when desk is curated-only English fallback (no locale-keyed cache hit). */
export function isUncachedCuratedDesk(
  bookId: string,
  chapter: number,
  verse: number,
  verseEnd: number | null | undefined,
  locale: Locale | null | undefined,
  desk: ReceptionResult | null,
): boolean {
  if (!desk?.cards.length) return false;
  if (getCached(bookId, chapter, verse, verseEnd, locale)) return false;
  return desk.cards.every(
    (c) => c.source === "curated" || c.source == null,
  );
}

export function isCardGenerated(
  card: SourceCard,
  bookId?: string,
  chapter?: number,
  verse?: number | null,
): boolean {
  if (card.source === "generated") return true;
  if (card.source === "curated") return false;
  if (bookId && chapter != null && verse != null) {
    const curated = getCuratedCardsForVerse(bookId, chapter, verse);
    const matchesCurated = curated.some(
      (c) =>
        c.voice.trim().toLowerCase() === card.voice.trim().toLowerCase() &&
        (c.citation.trim().toLowerCase() === card.citation.trim().toLowerCase() ||
          c.work.trim().toLowerCase() === card.work.trim().toLowerCase()),
    );
    return !matchesCurated;
  }
  return false;
}

export function getDeskNotes(
  bookId: string,
  chapter: number,
  verse: number | null,
  verseEnd?: number | null,
  locale?: Locale | null,
): ReceptionResult | null {
  if (verse != null) {
    const cached = getCached(bookId, chapter, verse, verseEnd, locale);
    if (cached && cached.cards.length > 0) return cached;
    const cur = getCurated(bookId, chapter, verse, verseEnd);
    if (cur && cur.cards.length > 0) return cur;
    return null;
  }
  return getCurated(bookId, chapter, null);
}

export function clearGeneratedNotesForVerse(
  bookId: string,
  chapter: number,
  verse: number,
  verseEnd?: number | null,
  locale?: Locale | null,
): ReceptionResult | null {
  if (locale != null) {
    removeCached(bookId, chapter, verse, verseEnd, locale);
  } else {
    removeCachedAllLocales(bookId, chapter, verse, verseEnd);
  }
  const cur = getCurated(bookId, chapter, verse, verseEnd);
  return cur && cur.cards.length > 0 ? cur : null;
}

export function clearGeneratedNotesForChapter(
  bookId: string,
  chapter: number,
): void {
  clearChapterCached(bookId, chapter);
}

export function hasCachedNotesInChapter(
  bookId: string,
  chapter: number,
): boolean {
  return cachedVerses(bookId, chapter).length > 0;
}

export function hasNotes(
  bookId: string,
  chapter: number,
  verse: number,
  locale?: Locale | null,
): boolean {
  return (
    hasCurated(bookId, chapter, verse) ||
    Boolean(getCached(bookId, chapter, verse, null, locale)) ||
    Boolean(getCached(bookId, chapter, verse, null, "en")) ||
    Boolean(getCached(bookId, chapter, verse, null, "es"))
  );
}

export function markedVerses(bookId: string, chapter: number): number[] {
  const set = new Set([
    ...curatedMarked(bookId, chapter),
    ...cachedVerses(bookId, chapter),
  ]);
  return [...set].sort((a, b) => a - b);
}

export function markedChapters(bookId: string): number[] {
  const set = new Set([
    ...curatedChapters(bookId),
    ...cachedChapters(bookId),
  ]);
  return [...set].sort((a, b) => a - b);
}

export function bookHasNotes(bookId: string): boolean {
  if (curatedBookIds().has(bookId)) return true;
  return cachedBookIds().includes(bookId);
}

export function rememberReception(
  bookId: string,
  chapter: number,
  verse: number,
  result: ReceptionResult,
  verseEnd?: number | null,
  locale?: Locale | null,
) {
  saveCached(bookId, chapter, verse, result, verseEnd, locale);
}
