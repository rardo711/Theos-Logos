import { BIBLE_BOOKS, bookName, type Locale } from "./books.ts";

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

export async function findScripture(
  q: string,
  locale: Locale,
): Promise<ScriptureHit[]> {
  const query = q.trim();
  if (query.length < 2) return [];
  const tx = locale === "es" ? "RV1960" : "ESV";
  const url = `https://bolls.life/v2/find/${tx}?search=${encodeURIComponent(query)}&match_case=false&match_whole=false&limit=24&page=1`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return [];
  const body: unknown = await res.json();
  return mapBollsHits(body, locale);
}
