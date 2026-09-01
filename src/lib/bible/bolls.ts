import { bollsBookId, bookName, type Locale } from "./books.ts";
import type { Book } from "./books.ts";
import type { Chapter, Verse } from "./types.ts";

export const NBLA_NAME = "Nueva Biblia de las Américas";
export const LBLA_NAME = "La Biblia de las Américas";

const NBLA_NOTE =
  "Nueva Biblia de las Américas (NBLA). © The Lockman Foundation. Used for study on this desk.";
const LBLA_NOTE =
  "La Biblia de las Américas (LBLA). © The Lockman Foundation. The public index does not yet serve NBLA; LBLA is Lockman’s earlier formal Spanish. Used for study on this desk.";

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

/** Spanish reader: prefer NBLA, fall back to LBLA (same Lockman house). */
export async function fetchSpanishChapter(
  book: Book,
  chapter: number,
): Promise<Chapter | null> {
  const cacheKey = `${book.id}-${chapter}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const num = bollsBookId(book.id);
  const attempts: { slug: string; name: string; note: string }[] = [
    { slug: "NBLA", name: NBLA_NAME, note: NBLA_NOTE },
    { slug: "LBLA", name: LBLA_NAME, note: LBLA_NOTE },
  ];

  for (const attempt of attempts) {
    try {
      const verses = await getText(attempt.slug, num, chapter);
      if (!verses) continue;
      const ch = toChapter(
        book,
        chapter,
        verses,
        "es",
        attempt.name,
        attempt.note,
      );
      if (ch) {
        cache.set(cacheKey, ch);
        return ch;
      }
    } catch {
      continue;
    }
  }
  return null;
}

