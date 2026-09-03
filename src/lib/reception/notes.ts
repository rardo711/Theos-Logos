import type { ReceptionResult, SourceCard } from "@/lib/bible/types";
import {
  cachedBookIds,
  cachedVerses,
  clearChapterCached,
  getCached,
  removeCached,
  saveCached,
} from "./cache.ts";
import {
  curatedBookIds,
  getCurated,
  getCuratedCardsForVerse,
  hasCurated,
  markedVerses as curatedMarked,
} from "./curated.ts";


/** Cards from a focused Inquire that are not already on the desk. */
export function additionalSourceCards(
  prior: SourceCard[],
  incoming: SourceCard[],
): SourceCard[] {
  const seenCite = new Set(prior.map((c) => `${c.voice}\0${c.citation}`));
  const seenQuote = new Set(
    prior.map((c) => c.quote.replace(/\s+/g, " ").trim().toLowerCase()),
  );
  const added: SourceCard[] = [];
  for (const c of incoming) {
    const cite = `${c.voice}\0${c.citation}`;
    const quote = c.quote.replace(/\s+/g, " ").trim().toLowerCase();
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
): ReceptionResult | null {
  if (verse != null) {
    const cached = getCached(bookId, chapter, verse);
    if (cached && cached.cards.length > 0) return cached;
    const cur = getCurated(bookId, chapter, verse);
    if (cur && cur.cards.length > 0) return cur;
    return null;
  }
  return getCurated(bookId, chapter, null);
}

export function clearGeneratedNotesForVerse(
  bookId: string,
  chapter: number,
  verse: number,
): ReceptionResult | null {
  removeCached(bookId, chapter, verse);
  const cur = getCurated(bookId, chapter, verse);
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
): boolean {
  return (
    hasCurated(bookId, chapter, verse) ||
    Boolean(getCached(bookId, chapter, verse))
  );
}

export function markedVerses(bookId: string, chapter: number): number[] {
  const set = new Set([
    ...curatedMarked(bookId, chapter),
    ...cachedVerses(bookId, chapter),
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
) {
  saveCached(bookId, chapter, verse, result);
}
