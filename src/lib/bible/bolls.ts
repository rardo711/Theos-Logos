import { bollsBookId, bookName, type Locale } from "./books.ts";
import type { Book } from "./books.ts";
import type { Chapter, Verse } from "./types.ts";

export const RV1960_NAME = "Reina-Valera 1960";

const RV1960_NOTE =
  "Reina-Valera 1960. © Sociedades Bíblicas en América Latina, 1960; © Sociedades Bíblicas Unidas, 1988. Used for study on this desk.";

const cache = new Map<string, Chapter>();

export function stripBollsHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
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
    const text = stripBollsHtml(v.text ?? "");
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

/** Spanish reader: Reina-Valera 1960. */
export async function fetchSpanishChapter(
  book: Book,
  chapter: number,
): Promise<Chapter | null> {
  const cacheKey = `RV1960-${book.id}-${chapter}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const num = bollsBookId(book.id);
  try {
    const verses = await getText("RV1960", num, chapter);
    if (!verses) return null;
    const ch = toChapter(
      book,
      chapter,
      verses,
      "es",
      RV1960_NAME,
      RV1960_NOTE,
    );
    if (ch) {
      cache.set(cacheKey, ch);
      return ch;
    }
  } catch {
    return null;
  }
  return null;
}

