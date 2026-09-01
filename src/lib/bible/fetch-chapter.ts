import { createServerFn } from "@tanstack/react-start";
import { getBook, type Locale } from "./books";
import { fetchSpanishChapter } from "./bolls";
import { fetchEsvChapter } from "./esv";
import { getSeed } from "./seed";
import type { Chapter, Verse } from "./types";

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

async function fetchWebChapter(
  book: ReturnType<typeof getBook>,
  chapter: number,
): Promise<Chapter | null> {
  const query = `${book.name} ${chapter}`.replace(/ /g, "+");
  const res = await fetch(`https://bible-api.com/${query}?translation=web`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as {
    reference?: string;
    verses?: { verse?: number; text?: string }[];
    translation_name?: string;
    translation_note?: string;
  };
  if (!body.verses?.length) return null;
  const verses: Verse[] = body.verses.map((v) => ({
    bookId: book.id,
    bookName: book.name,
    chapter,
    verse: Number(v.verse) || 0,
    text: stripHtml(v.text ?? ""),
  }));
  return {
    reference: body.reference || `${book.name} ${chapter}`,
    bookId: book.id,
    bookName: book.name,
    chapter,
    verses,
    translationName: body.translation_name || "World English Bible",
    translationNote:
      body.translation_note || "World English Bible. Public domain.",
  };
}

export const fetchChapter = createServerFn({ method: "POST" })
  .validator(
    (input: { bookId: string; chapter: number; locale?: Locale }) => input,
  )
  .handler(async ({ data }): Promise<Chapter> => {
    const book = getBook(data.bookId);
    const chapter = Math.min(Math.max(1, data.chapter), book.chapters);
    const locale: Locale = data.locale === "es" ? "es" : "en";
    const seeded = locale === "en" ? getSeed(book.id, chapter) : undefined;

    if (locale === "es") {
      try {
        const es = await fetchSpanishChapter(book, chapter);
        if (es) return es;
      } catch {
        // fall through
      }
      throw new Error(`No se pudo cargar ${book.name} ${chapter} en español.`);
    }

    try {
      const esv = await fetchEsvChapter(book, chapter);
      if (esv) return esv;
    } catch {
      // ESV is optional; fall through to WEB / seed.
    }

    try {
      const web = await fetchWebChapter(book, chapter);
      if (web) return web;
    } catch (err) {
      if (seeded) return seeded;
      throw err instanceof Error
        ? err
        : new Error(`Could not load ${book.name} ${chapter}.`);
    }

    if (seeded) return seeded;
    throw new Error(`Could not load ${book.name} ${chapter}.`);
  });
