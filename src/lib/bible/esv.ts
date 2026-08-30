import type { Book } from "./books";
import type { Chapter, Verse } from "./types";

export const ESV_NAME = "English Standard Version";
export const ESV_NOTE =
  "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.";

const cache = new Map<string, Chapter>();

export function esvApiKey(): string | undefined {
  const key = process.env.ESV_API_KEY?.trim();
  return key || undefined;
}

export function esvQuery(book: Book, chapter: number): string {
  const name = book.id === "PSA" ? "Psalm" : book.name;
  return `${name} ${chapter}`;
}

/** Split an ESV passage-text payload into numbered verses. */
export function parseEsvPassage(passage: string): { verse: number; text: string }[] {
  const cleaned = passage
    .replace(/\u00a0/g, " ")
    .replace(/\(ESV\)\s*$/i, "")
    .replace(/\r/g, "")
    .trim();
  const marks = [...cleaned.matchAll(/\[(\d+)\]\s*/g)];
  if (!marks.length) return [];

  const verses: { verse: number; text: string }[] = [];
  for (let i = 0; i < marks.length; i++) {
    const mark = marks[i];
    const start = (mark.index ?? 0) + mark[0].length;
    const end = i + 1 < marks.length ? (marks[i + 1].index ?? cleaned.length) : cleaned.length;
    const text = cleaned.slice(start, end).replace(/\s+/g, " ").trim();
    const verse = Number(mark[1]);
    if (!verse || !text) continue;
    verses.push({ verse, text });
  }
  return verses;
}

export async function fetchEsvChapter(
  book: Book,
  chapter: number,
): Promise<Chapter | null> {
  const key = esvApiKey();
  if (!key) return null;

  const cacheKey = `${book.id}-${chapter}`;
  const hit = cache.get(cacheKey);
  if (hit) return hit;

  const q = esvQuery(book, chapter);
  const params = new URLSearchParams({
    q,
    "include-passage-references": "false",
    "include-verse-numbers": "true",
    "include-first-verse-numbers": "true",
    "include-footnotes": "false",
    "include-footnote-body": "false",
    "include-headings": "false",
    "include-short-copyright": "false",
    "include-copyright": "false",
    "include-selahs": "true",
    "include-passage-horizontal-lines": "false",
    "include-heading-horizontal-lines": "false",
    "indent-paragraphs": "0",
    "indent-poetry": "0",
    "indent-poetry-lines": "0",
    "indent-declares": "0",
    "indent-verse-paragraphs": "0",
  });

  const res = await fetch(`https://api.esv.org/v3/passage/text/?${params}`, {
    headers: {
      Authorization: `Token ${key}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;

  const body = (await res.json()) as { passages?: string[]; canonical?: string };
  const passage = body.passages?.[0];
  if (!passage) return null;

  const parsed = parseEsvPassage(passage);
  if (!parsed.length) return null;

  const verses: Verse[] = parsed.map((v) => ({
    bookId: book.id,
    bookName: book.name,
    chapter,
    verse: v.verse,
    text: v.text,
  }));

  const result: Chapter = {
    reference: body.canonical || `${book.name} ${chapter}`,
    bookId: book.id,
    bookName: book.name,
    chapter,
    verses,
    translationName: ESV_NAME,
    translationNote: ESV_NOTE,
  };
  cache.set(cacheKey, result);
  return result;
}
