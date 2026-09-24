import { bollsBookId, bookName, type Locale } from "./books.ts";
import type { Book } from "./books.ts";
import type { Chapter, Verse } from "./types.ts";

const cache = new Map<string, Chapter>();

export function stripBollsHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * bolls.life embeds Strong's numbers inline in some feeds, either as
 * <S>1722</S> tags or ~~1722~~ markers. They are data, not display text.
 */
export function stripStrongs(s: string): string {
  return s.replace(/<S>\d+<\/S>/g, "").replace(/~~\d+~~/g, "");
}

type BollsVerse = { verse?: number; text?: string };

async function getText(
  slug: string,
  bookNum: number,
  chapter: number,
): Promise<BollsVerse[] | null> {
  const res = await fetch(
    `https://bolls.life/get-text/${encodeURIComponent(slug)}/${bookNum}/${chapter}/`,
    {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!res.ok) return null;
  const body = (await res.json()) as BollsVerse[] | { detail?: string };
  if (!Array.isArray(body) || !body.length) return null;
  return body;
}

function toChapter(
  book: Book,
  chapter: number,
  verses: BollsVerse[],
  locale: Locale,
  name: string,
  note: string,
): Chapter | null {
  const out: Verse[] = [];
  for (const v of verses) {
    const n = Number(v.verse) || 0;
    const text = stripBollsHtml(stripStrongs(v.text ?? ""));
    if (!n || !text) continue;
    out.push({
      bookId: book.id,
      bookName: bookName(book, locale),
      chapter,
      verse: n,
      text,
    });
  }
  if (!out.length) return null;
  return {
    reference: `${bookName(book, locale)} ${chapter}`,
    bookId: book.id,
    bookName: bookName(book, locale),
    chapter,
    verses: out,
    translationName: name,
    translationNote: note,
  };
}

/** Chapter fetch through the bolls.life pipe, parameterized by slug. */
export async function fetchBollsChapter(
  slug: string,
  book: Book,
  chapter: number,
  locale: Locale,
  name: string,
  note: string,
): Promise<Chapter | null> {
  const cacheKey = `${slug}-${book.id}-${chapter}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const num = bollsBookId(book.id);
  try {
    const verses = await getText(slug, num, chapter);
    if (!verses) return null;
    const ch = toChapter(book, chapter, verses, locale, name, note);
    if (ch) {
      cache.set(cacheKey, ch);
      return ch;
    }
  } catch {
    return null;
  }
  return null;
}
