import { BIBLE_BOOKS, bookName, type Locale } from "./books.ts";
import { loadRv1909Book } from "./rv1909.ts";

export interface ScriptureHit {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

function strip(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function mapBollsHits(raw: unknown, locale: Locale): ScriptureHit[] {
  const rows = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object" && Array.isArray((raw as { results?: unknown }).results)
      ? (raw as { results: unknown[] }).results
      : [];
  const hits: ScriptureHit[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const book = BIBLE_BOOKS[Number(r.book) - 1];
    if (!book) continue;
    const chapter = Number(r.chapter);
    const verse = Number(r.verse);
    const text = strip(String(r.text ?? ""));
    if (!chapter || !verse || !text) continue;
    hits.push({
      bookId: book.id,
      bookName: bookName(book, locale),
      chapter,
      verse,
      text,
    });
    if (hits.length >= 24) break;
  }
  return hits;
}

/** Accent-insensitive lowercase for Spanish matching. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

let rv1909Index: Promise<ScriptureHit[]> | null = null;

/** Whole-Bible RV1909 index, built once and cached for the session. */
function getRv1909Index(): Promise<ScriptureHit[]> {
  if (!rv1909Index) {
    rv1909Index = (async () => {
      const hits: ScriptureHit[] = [];
      for (const book of BIBLE_BOOKS) {
        const data = await loadRv1909Book(book.id);
        if (!data) continue;
        const bName = bookName(book, "es");
        data.chapters.forEach((verses, ci) => {
          verses.forEach((text, vi) => {
            hits.push({
              bookId: book.id,
              bookName: bName,
              chapter: ci + 1,
              verse: vi + 1,
              text,
            });
          });
        });
      }
      return hits;
    })();
  }
  return rv1909Index;
}

export async function findRv1909(q: string): Promise<ScriptureHit[]> {
  const needle = norm(q.trim());
  if (needle.length < 2) return [];
  const index = await getRv1909Index();
  const out: ScriptureHit[] = [];
  for (const hit of index) {
    if (norm(hit.text).includes(needle)) {
      out.push(hit);
      if (out.length >= 24) break;
    }
  }
  return out;
}

export async function findScripture(
  q: string,
  locale: Locale,
): Promise<ScriptureHit[]> {
  const query = q.trim();
  if (query.length < 2) return [];
  if (locale === "es") return findRv1909(query);
  const tx = "ESV";
  const url = `https://bolls.life/v2/find/${tx}?search=${encodeURIComponent(query)}&match_case=false&match_whole=false&limit=24&page=1`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return [];
  const body: unknown = await res.json();
  return mapBollsHits(body, locale);
}
