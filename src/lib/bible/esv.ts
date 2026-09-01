import type { Book } from "./books";
import type { Chapter, Verse } from "./types";

export const ESV_NAME = "English Standard Version";
export const ESV_NOTE =
  "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.";

type ParsedVerse = { verse: number; text: string; title?: string };

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

export function esvApiKey(): string | undefined {
  const key = process.env.ESV_API_KEY?.trim();
  return key || undefined;
}

export function esvQuery(book: Book, chapter: number): string {
  const name = book.id === "PSA" ? "Psalm" : book.name;
  return `${name} ${chapter}`;
}

const ESV_ENTITIES: Record<string, string> = {
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
};

export function decodeEsvEntities(s: string): string {
  return s
    .replace(/&(#\d+|#x[0-9a-fA-F]+|[a-z]+);/g, (m, ent: string) => {
      if (ent[0] === "#") {
        const n = ent[1] === "x" || ent[1] === "X"
          ? parseInt(ent.slice(2), 16)
          : Number(ent.slice(1));
        return Number.isFinite(n) ? String.fromCodePoint(n) : m;
      }
      return ESV_ENTITIES[ent] ?? m;
    });
}

/** Split an ESV passage-text payload into numbered verses (headings optional). */
export function parseEsvPassage(passage: string): ParsedVerse[] {
  const cleaned = passage
    .replace(/\u00a0/g, " ")
    .replace(/\(ESV\)\s*$/i, "")
    .replace(/\r/g, "")
    .trim();
  const marks = [...cleaned.matchAll(/\[(\d+)\]\s*/g)];
  if (!marks.length) return [];

  const verses: ParsedVerse[] = [];
  for (let i = 0; i < marks.length; i++) {
    const mark = marks[i];
    const start = (mark.index ?? 0) + mark[0].length;
    const end =
      i + 1 < marks.length ? (marks[i + 1].index ?? cleaned.length) : cleaned.length;
    const raw = cleaned.slice(start, end);
    const verse = Number(mark[1]);
    if (!verse) continue;
    verses.push({ verse, text: raw });
  }
  if (!verses.length) return [];

  const preface = cleaned.slice(0, marks[0].index ?? 0);
  const pref = peelHeading(preface);
  if (pref.heading && !verses[0].title) verses[0].title = pref.heading;

  for (let i = 0; i < verses.length; i++) {
    const peeled = peelHeading(verses[i].text);
    verses[i].text = peeled.body.replace(/\s+/g, " ").trim();
    if (peeled.heading && i + 1 < verses.length && !verses[i + 1].title) {
      verses[i + 1].title = peeled.heading;
    }
  }
  return verses.filter((v) => v.text.length > 0);
}

function isHeadingLine(line: string): boolean {
  const s = line.trim();
  if (s.length < 3 || s.length > 72) return false;
  if (/\[\d+\]/.test(s)) return false;
  if (/^\(.*\)$/.test(s)) return false;
  if (/^[1-3]?\s*[A-Za-z][A-Za-z.’']+\s+\d+$/.test(s)) return false;
  if (!/^[\p{Lu}“"']/u.test(s)) return false;
  if (s.split(/\s+/).length > 12) return false;
  if (/[.!]$/.test(s)) return false;
  return true;
}

function peelHeading(block: string): { body: string; heading?: string } {
  const trimmed = block.replace(/\s+$/u, "");
  if (!trimmed.trim()) return { body: block };
  const lines = trimmed.split("\n");
  let last = lines.length - 1;
  while (last >= 0 && !lines[last].trim()) last -= 1;
  if (last < 0) return { body: block };
  const candidate = lines[last].trim();
  if (isHeadingLine(candidate)) {
    return { body: lines.slice(0, last).join("\n"), heading: candidate };
  }
  const inline = trimmed.match(/([.!?])\s+([\p{Lu}][^\n]{2,70})$/u);
  if (inline && isHeadingLine(inline[2])) {
    return {
      body: trimmed.slice(0, (inline.index ?? 0) + 1),
      heading: inline[2].trim(),
    };
  }
  return { body: block };
}

/**
 * Parse ESV passage HTML. Section headings (h3/h4) attach to the verse
 * that immediately follows them — the same contract as the main branch.
 */
export function parseEsvHtml(html: string): ParsedVerse[] {
  let bodyText = html
    .replace(/<h2[^>]*>[\s\S]*?<\/h2>/gi, " ")
    .replace(
      /<h[34][^>]*>([\s\S]*?)<\/h[34]>/gi,
      (_m, t: string) => `\x01${t.replace(/<[^>]+>/g, "").trim()}\x02`,
    )
    .replace(
      /<(?:p|div)[^>]*class=["'][^"']*extra_text[^"']*["'][^>]*>([\s\S]*?)<\/(?:p|div)>/gi,
      (_m, t: string) => {
        const inner = t.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
        if (!inner || inner.length > 80 || /listen|\(esv\)/i.test(inner)) return " ";
        return `\x01${inner}\x02`;
      },
    )
    .replace(
      /<(?:b|span)[^>]*class=["'][^"']*(?:verse-num|chapter-num)[^"']*["'][^>]*>\s*(\d+)[\s\S]*?<\/(?:b|span)>/gi,
      (_m, n: string) => `\x03${n}\x04`,
    )
    .replace(/<[^>]+>/g, " ");
  bodyText = decodeEsvEntities(bodyText);

  const re = /\x01([^\x02]*)\x02|\x03(\d+)\x04/g;
  const verses: ParsedVerse[] = [];
  let pendingTitle: string | undefined;
  let preface = "";
  let current: ParsedVerse | null = null;
  let cursor = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(bodyText))) {
    const between = bodyText.slice(cursor, m.index);
    if (current) current.text += between;
    else preface += between;
    cursor = re.lastIndex;
    if (m[1] !== undefined) {
      pendingTitle = m[1].replace(/\s+/g, " ").trim() || undefined;
    } else {
      current = { verse: Number(m[2]), text: "", title: pendingTitle };
      pendingTitle = undefined;
      verses.push(current);
    }
  }
  if (current) current.text += bodyText.slice(cursor);
  if (verses[0] && preface.trim()) {
    verses[0].text = `${preface} ${verses[0].text}`;
  }
  for (const v of verses) v.text = v.text.replace(/\s+/g, " ").trim();
  return verses.filter((v) => v.text.length > 0);
}

function toChapter(
  book: Book,
  chapter: number,
  parsed: ParsedVerse[],
  canonical?: string,
): Chapter {
  const verses: Verse[] = parsed.map((v) => ({
    bookId: book.id,
    bookName: book.name,
    chapter,
    verse: v.verse,
    text: v.text,
    title: v.title,
  }));
  return {
    reference: canonical || `${book.name} ${chapter}`,
    bookId: book.id,
    bookName: book.name,
    chapter,
    verses,
    translationName: ESV_NAME,
    translationNote: ESV_NOTE,
  };
}

export async function fetchEsvChapter(
  book: Book,
  chapter: number,
): Promise<Chapter | null> {
  const key = esvApiKey();
  if (!key) return null;

  const cacheKey = `${book.id}-${chapter}`;
  const hit = cache.get(cacheKey);
  if (hit) {
    remember(cacheKey, hit);
    return hit;
  }

  const q = esvQuery(book, chapter);
  const headers = {
    Authorization: `Token ${key}`,
    Accept: "application/json",
  };
  const signal = AbortSignal.timeout(8000);

  const htmlParams = new URLSearchParams({
    q,
    "include-passage-references": "false",
    "include-headings": "true",
    "include-subheadings": "true",
    "include-verse-numbers": "true",
    "include-first-verse-numbers": "true",
    "include-chapter-numbers": "false",
    "include-footnotes": "false",
    "include-audio-link": "false",
    "include-short-copyright": "false",
    "include-css-link": "false",
  });

  try {
    const res = await fetch(
      `https://api.esv.org/v3/passage/html/?${htmlParams}`,
      { headers, signal },
    );
    if (res.ok) {
      const body = (await res.json()) as {
        passages?: string[];
        canonical?: string;
      };
      const html = body.passages?.[0] ?? "";
      const parsed = html.trim() ? parseEsvHtml(html) : [];
      if (parsed.length) {
        const result = toChapter(book, chapter, parsed, body.canonical);
        remember(cacheKey, result);
        return result;
      }
    }
  } catch {
    // Fall through to the text endpoint.
  }

  const textParams = new URLSearchParams({
    q,
    "include-passage-references": "false",
    "include-verse-numbers": "true",
    "include-first-verse-numbers": "true",
    "include-footnotes": "false",
    "include-footnote-body": "false",
    "include-headings": "true",
    "include-short-copyright": "false",
    "include-copyright": "false",
    "include-selahs": "true",
    "indent-paragraphs": "0",
    "indent-poetry": "0",
    "indent-poetry-lines": "0",
    "indent-declares": "0",
    "indent-verse-paragraphs": "0",
  });

  const res = await fetch(`https://api.esv.org/v3/passage/text/?${textParams}`, {
    headers,
    signal,
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { passages?: string[]; canonical?: string };
  const passage = body.passages?.[0];
  if (!passage) return null;
  const parsed = parseEsvPassage(passage);
  if (!parsed.length) return null;
  const result = toChapter(book, chapter, parsed, body.canonical);
  remember(cacheKey, result);
  return result;
}
