import { bookName, type Book, type Locale } from "./books.ts";
import type { Chapter, Verse } from "./types.ts";

/**
 * Reina Valera 1909, public domain (eBible.org `spaRV1909` USFM, converted
 * once to compact per-book JSON). Served locally — no API key, no rate
 * limit, no third-party dependency. Books load lazily, one JSON per book.
 */

interface Rv1909Book {
  id: string;
  chapters: string[][];
}

const cache = new Map<string, Rv1909Book>();

export async function loadRv1909Book(
  bookId: string,
): Promise<Rv1909Book | null> {
  const hit = cache.get(bookId);
  if (hit) return hit;
  try {
    const mod = await import(`./rv1909/${bookId}.json`, {
      with: { type: "json" },
    });
    const data = (mod.default ?? mod) as Rv1909Book;
    if (!data || !Array.isArray(data.chapters)) return null;
    cache.set(bookId, data);
    return data;
  } catch {
    return null;
  }
}

export async function fetchRv1909Chapter(
  book: Book,
  chapter: number,
  name: string,
  note: string,
  locale: Locale,
): Promise<Chapter | null> {
  const data = await loadRv1909Book(book.id);
  const texts = data?.chapters[chapter - 1];
  if (!texts || texts.length === 0) return null;
  const bName = bookName(book, locale);
  const verses: Verse[] = texts.map((text, i) => ({
    bookId: book.id,
    bookName: bName,
    chapter,
    verse: i + 1,
    text,
  }));
  return {
    reference: `${bName} ${chapter}`,
    bookId: book.id,
    bookName: bName,
    chapter,
    verses,
    translationName: name,
    translationNote: note,
  };
}
