import type { ReceptionResult, SourceCard } from "@/lib/bible/types";
import {
  cachedBookIds,
  cachedVerses,
  getCached,
  saveCached,
} from "./cache";
import {
  curatedBookIds,
  getCurated,
  hasCurated,
  markedVerses as curatedMarked,
} from "./curated";


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
    added.push(c);
  }
  return added;
}

export function getDeskNotes(
  bookId: string,
  chapter: number,
  verse: number | null,
): ReceptionResult | null {
  if (verse != null) {
    return getCached(bookId, chapter, verse) ?? getCurated(bookId, chapter, verse);
  }
  return getCurated(bookId, chapter, null);
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
