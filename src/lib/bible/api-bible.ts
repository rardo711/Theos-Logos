import type { Book } from "./books.ts";
import type { Chapter, Verse } from "./types.ts";

/**
 * API.Bible (scripture.api.bible) on-demand translations.
 *
 * These three are copyrighted, so their text is NEVER bundled in the repo:
 * chapters are fetched server-side at request time through a small bounded
 * in-memory cache, using the API_BIBLE_KEY env var. The browser never sees
 * the key. Attribution rides along on every chapter via `translationNote`.
 */

export const NKJV_BIBLE_ID = "63097d2a0a2f7db3-01";
export const NASB_BIBLE_ID = "b8ee27bcd1cae43a-01";
export const NBLA_BIBLE_ID = "ce11b813f9a27e20-01";

export const NKJV_NAME = "New King James Version";
export const NKJV_NOTE =
  "New King James Version®. Copyright © 1982 by Thomas Nelson. All rights reserved.";
export const NASB_NAME = "New American Standard Bible";
export const NASB_NOTE =
  "New American Standard Bible®. Copyright © 1960, 1971, 1977, 1995 by The Lockman Foundation. All rights reserved. (www.Lockman.org)";
export const NBLA_NAME = "Nueva Biblia de las Américas";
export const NBLA_NOTE =
  "Nueva Biblia de las Américas™. Copyright © 2005 by The Lockman Foundation. Todos los derechos reservados.";

const cache = new Map<string, Chapter>();
const CACHE_MAX = 24;

function remember(key: string, chapter: Chapter) {
  cache.delete(key);
  cache.set(key, chapter);
  while (cache.size > CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest == null) break;
    cache.delete(oldest);
  }
}

export function apiBibleKey(): string | undefined {
  const key = process.env.API_BIBLE_KEY?.trim();
  return key || undefined;
}

/** App book id -> API.Bible book id (they differ only for Ezekiel). */
const BOOK_ID_OVERRIDES: Record<string, string> = { EZE: "EZK" };

function apiBookId(book: Book): string {
  return BOOK_ID_OVERRIDES[book.id] ?? book.id;
}

interface ApiBibleChapterBody {
  data?: {
    id?: string;
    reference?: string;
    copyright?: string;
    content?: string;
  };
}

type ParsedVerse = { verse: number; text: string; title?: string };

/**
 * A bare line is a section heading (not a verse continuation) when it is
 * short, starts uppercase, carries no sentence-ending punctuation, and does
 * not end mid-sentence on , ; or :. This keeps short verses like
 * "[22] And on some have compassion, making a distinction;" intact.
 */
function looksLikeHeading(s: string): boolean {
  const t = s.trim();
  if (t.length < 3 || t.length > 80) return false;
  if (/[.!?]$/.test(t)) return false;
  if (/[,;:]$/.test(t)) return false;
  if (!/^[\p{Lu}“"']/u.test(t)) return false;
  if (t.split(/\s+/).length > 12) return false;
  return true;
}

const VERSE_MARK = /\[(\d+)\]/g;

/**
 * Split API.Bible text-chapter content into numbered verses.
 * Verse markers [N] may sit mid-line; headings ride on their own lines
 * directly above the verse they introduce and attach as that verse's title.
 */
export function parseApiBibleText(content: string): ParsedVerse[] {
  const lines = content.replace(/\r/g, "").split("\n");
  const verses: ParsedVerse[] = [];
  let current: ParsedVerse | null = null;
  let pendingTitle: string | undefined;

  const openVerse = (n: number): ParsedVerse => {
    const v: ParsedVerse = { verse: n, text: "", title: pendingTitle };
    pendingTitle = undefined;
    verses.push(v);
    return v;
  };

  /** Index of the next non-blank line at or after i. */
  const nextLine = (i: number): string | undefined => {
    for (let j = i; j < lines.length; j++) {
      if (lines[j].trim()) return lines[j];
    }
    return undefined;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let cursor = 0;
    VERSE_MARK.lastIndex = 0;
    let m: RegExpExecArray | null;
    let sawMark = false;
    while ((m = VERSE_MARK.exec(line))) {
      sawMark = true;
      const before = line.slice(cursor, m.index);
      if (before.trim()) {
        if (!current) {
          pendingTitle = pendingTitle
            ? `${pendingTitle} ${before.trim()}`
            : before.trim();
        } else {
          current.text += ` ${before.trim()}`;
        }
      }
      current = openVerse(Number(m[1]));
      cursor = VERSE_MARK.lastIndex;
    }
    const rest = line.slice(cursor).trim();
    if (!rest) continue;
    if (!sawMark) {
      // Whole line without a marker: heading or continuation.
      if (!current) {
        pendingTitle = pendingTitle ? `${pendingTitle} ${rest}` : rest;
      } else {
        const nl = nextLine(i + 1);
        const followedByVerse =
          nl != null && /^\s*\[\d+\]/.test(nl);
        if (followedByVerse && looksLikeHeading(rest)) {
          pendingTitle = rest;
        } else {
          current.text += ` ${rest}`;
        }
      }
    } else if (current) {
      current.text += ` ${rest}`;
    }
  }

  for (const v of verses) v.text = v.text.replace(/\s+/g, " ").trim();
  return verses.filter((v) => v.text.length > 0);
}

export async function fetchApiBibleChapter(
  bibleId: string,
  book: Book,
  chapter: number,
  fallbackName: string,
  fallbackNote: string,
): Promise<Chapter | null> {
  const key = apiBibleKey();
  if (!key) return null;

  const cacheKey = `${bibleId}:${book.id}:${chapter}`;
  const hit = cache.get(cacheKey);
  if (hit) {
    remember(cacheKey, hit);
    return hit;
  }

  const params = new URLSearchParams({
    "content-type": "text",
    "include-notes": "false",
    "include-titles": "true",
    "include-chapter-numbers": "false",
    "include-verse-numbers": "true",
  });
  const res = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${bibleId}/chapters/${apiBookId(book)}.${chapter}?${params}`,
    {
      headers: { "api-key": key, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!res.ok) return null;
  const body = (await res.json()) as ApiBibleChapterBody;
  const content = body.data?.content?.trim();
  if (!content) return null;

  // API.Bible text chapters use [N] verse markers with section headings on
  // their own lines; parseApiBibleText keeps short verses intact.
  const parsed = parseApiBibleText(content);
  if (!parsed.length) return null;

  const verses: Verse[] = parsed.map((v) => ({
    bookId: book.id,
    bookName: book.name,
    chapter,
    verse: v.verse,
    text: v.text,
    title: v.title,
  }));
  const result: Chapter = {
    reference: body.data?.reference || `${book.name} ${chapter}`,
    bookId: book.id,
    bookName: book.name,
    chapter,
    verses,
    translationName: fallbackName,
    // Per-chapter copyright from the API when present; registry note otherwise.
    translationNote: body.data?.copyright?.trim() || fallbackNote,
  };
  remember(cacheKey, result);
  return result;
}
