import type { ReceptionResult } from "@/lib/bible/types";
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

export function getDeskNotes(
  bookId: string,
  chapter: number,
  verse: number | null,
): ReceptionResult | null {
  if (verse == null) return null;
  return getCached(bookId, chapter, verse) ?? getCurated(bookId, chapter, verse);
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
