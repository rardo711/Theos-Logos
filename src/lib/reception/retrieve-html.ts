import { type CatalogEntry, tokenize } from "./catalog.ts";

export type FetchedExtract = {
  entry: CatalogEntry;
  url: string;
  paragraphs: string[];
};

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, " ")
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, " ")
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, " ")
    .replace(/<table\b[^>]*class=["'][^"']*book_navbar[^"']*["'][^>]*>[\s\S]*?<\/table>/gi, " ")
    .replace(
      /<div\b[^>]*(?:id|class)=["'][^"']*(?:navbar|header|banner|workinfo|reader-toc|selection-popup|popover|nav-top|book_menu|searchbox|usertagbar|toolbar|crumbs|breadcrumb)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi,
      " ",
    );
}

export function htmlToText(html: string): string {
  const clean = sanitizeHtml(html);
  return clean
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/"/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/&mdash;/gi, "\u2014")
    .replace(/&ndash;/gi, "\u2013")
    .replace(/&hellip;/gi, "...")
    .replace(/\s+/g, " ")
    .trim();
}

export function isBoilerplate(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 15) return true;
  if (trimmed.length < 35 && !/[.;:?!]/.test(trimmed)) return true;
  const lower = trimmed.toLowerCase();

  if (
    lower.includes("christian classics ethereal library") ||
    lower.includes("ccel.org") ||
    lower.includes("browse titles") ||
    lower.includes("browse authors") ||
    lower.includes("work info:") ||
    lower.includes("work info") ||
    lower.includes("please help support the mission of new advent") ||
    (lower.includes("new advent") &&
      (lower.includes("instant download") ||
        lower.includes("catholic encyclopedia") ||
        lower.includes("home >"))) ||
    lower.includes("disable scripture popups") ||
    (lower.includes("bible version") && lower.includes("scripture popups")) ||
    lower.includes("theological markup language") ||
    lower.includes("pdf microsoft word") ||
    lower.includes("reader width") ||
    lower.includes("text size") ||
    lower.includes("show footnotes") ||
    lower.includes("search this book") ||
    lower.includes("search within this book") ||
    lower.includes("highlight selected text") ||
    lower.includes("please login or register") ||
    lower.includes("log in | register") ||
    lower.includes("all rights reserved") ||
    lower.includes("public domain") ||
    lower.includes("union theological seminary") ||
    lower.includes("grand rapids, mi") ||
    lower.includes("wm. b. eerdmans") ||
    lower.includes("baker book house") ||
    lower.includes("the following sermon is taken from volume") ||
    lower.includes("bible hub") ||
    lower.includes("biblehub") ||
    lower.includes("commentaries menu") ||
    lower.includes("parallel commentaries") ||
    lower.includes("godrules.net") ||
    lower.includes("bad advertisement") ||
    lower.includes("online store: visit our store")
  ) {
    return true;
  }

  if (
    lower.startsWith("translated by") ||
    lower.startsWith("edited by") ||
    lower.startsWith("preface") ||
    lower.startsWith("contents") ||
    lower.startsWith("table of contents") ||
    lower.startsWith("index") ||
    lower.startsWith("title page") ||
    lower.startsWith("born:") ||
    lower.startsWith("died:") ||
    lower.startsWith("related topics:") ||
    lower.startsWith("work:") ||
    lower.startsWith("author:")
  ) {
    return true;
  }

  if (
    lower.includes("assorted sermons by martin luther") ||
    lower.includes("assorted sermons")
  ) {
    if (lower.split(/\s+/).length < 15) return true;
  }

  const pipeCount = (trimmed.match(/\|/g) || []).length;
  if (pipeCount >= 2) return true;

  const breadcrumbCount = (trimmed.match(/[>\u00bb\u00ab]/g) || []).length;
  if (breadcrumbCount >= 3) return true;

  if (trimmed.length >= 50 && !/[.;:?!]/.test(trimmed)) {
    return true;
  }

  const words = trimmed.split(/\s+/).filter((w) => w.length > 1);
  if (words.length >= 8) {
    const capitalized = words.filter((w) => /^[A-Z]/.test(w)).length;
    if (capitalized / words.length > 0.6) {
      return true;
    }
  }

  if (isEmbeddedScripture(text)) {
    return true;
  }

  return false;
}

export function isEmbeddedScripture(text: string): boolean {
  const trimmed = text.trim();
  const verseMarkers = trimmed.match(/(?:^|\.\s+|\s)\d{1,3}\s+[A-Z][a-z]+/g);
  if (verseMarkers && verseMarkers.length >= 2) {
    if (/^\d{1,3}\s+[A-Z]/.test(trimmed) || verseMarkers.length >= 3) {
      return true;
    }
  }
  return false;
}

export function truncateAtSentence(text: string, maxLen = 520): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;

  const sentenceMatches = Array.from(trimmed.matchAll(/[.!?](?=\s|$)/g));
  let bestCut = -1;
  for (const m of sentenceMatches) {
    const end = (m.index ?? 0) + 1;
    if (end <= maxLen && end >= 120) {
      bestCut = end;
    }
  }

  if (bestCut > 0) {
    return trimmed.slice(0, bestCut).trim();
  }

  const clauseMatches = Array.from(trimmed.matchAll(/[;:][\s]/g));
  for (const m of clauseMatches) {
    const end = (m.index ?? 0) + 1;
    if (end <= maxLen && end >= 120) {
      bestCut = end;
    }
  }
  if (bestCut > 0) {
    return trimmed.slice(0, bestCut).trim() + "\u2026";
  }

  const lastSpace = trimmed.lastIndexOf(" ", maxLen);
  if (lastSpace > 60) {
    return trimmed.slice(0, lastSpace).trim() + "\u2026";
  }

  return trimmed.slice(0, maxLen).trim() + "\u2026";
}

export function isSubstantiveQuote(text: string): boolean {
  if (isBoilerplate(text) || isEmbeddedScripture(text)) return false;
  const trimmed = text.trim();
  if (trimmed.length < 15) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;
  return true;
}

export function paragraphsFromHtml(html: string): string[] {
  const clean = sanitizeHtml(html);
  const chunks = clean.split(/<\/p>|<br\s*\/?>|<\/div>|<\/h[1-6]>/i);
  const out: string[] = [];
  const seen = new Set<string>();
  for (const chunk of chunks) {
    const text = htmlToText(chunk);
    if (text.length < 80 || text.length > 2200) continue;
    if (isBoilerplate(text) || !isSubstantiveQuote(text)) continue;
    const key = text.slice(0, 80).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

/**
 * True when a paragraph announces the target verse. CCEL, New Advent and Bible
 * Hub print the lemma in a handful of fixed shapes: a leading verse number, a
 * "Ver./Verse" label, a "v./vv." abbreviation, or a chapter:verse reference.
 * Ranges ("Ver. 6-13", "9:6-13") count when the target falls inside them.
 */
export function paragraphMentionsVerse(
  text: string,
  chapter: number,
  verse: number,
): boolean {
  const trimmed = text.trim();

  // "11. Though they were not yet born..." — the lemma opens the paragraph.
  const lead = /^(\d{1,3})\s*[.:)\]]/.exec(trimmed);
  if (lead && Number(lead[1]) === verse) return true;

  // "Ver. 11", "Verse 11", "Verses 9-13", "v. 11", "vv. 9-13".
  const labelled = /\b(?:ver(?:s|se|ses)?|vv?)\.?\s*(\d{1,3})(?:\s*[-\u2013\u2014]\s*(\d{1,3}))?/gi;
  for (const m of trimmed.matchAll(labelled)) {
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    if (verse >= start && verse <= Math.max(start, end)) return true;
  }

  // "9:11" or "9:6-13" — a full chapter:verse reference.
  const refs = new RegExp(`\\b${chapter}:(\\d{1,3})(?:\\s*[-\\u2013\\u2014]\\s*(\\d{1,3}))?`, "g");
  for (const m of trimmed.matchAll(refs)) {
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    if (verse >= start && verse <= Math.max(start, end)) return true;
  }

  return false;
}

/**
 * Paragraph selection that knows which verse it is looking for. A page can
 * cover a whole chapter (Henry) or a neighbouring pericope (Calvin on CCEL is
 * split by pericope, so a chapter-level row can land on the wrong page); the
 * marker bonus keeps the lemma paragraph ahead of a merely word-similar one.
 * Falls back to plain token scoring when no paragraph names the verse.
 */
export function pickVerseParagraphs(
  paragraphs: string[],
  chapter: number | undefined,
  verse: number | undefined,
  query: string,
  limit = 4,
  verseEnd?: number | null,
): string[] {
  if (chapter == null || verse == null) {
    return pickParagraphs(paragraphs, query, limit);
  }
  // With a range selected, a paragraph naming any verse in it is on target.
  // Scoring only the first verse would rank commentary on 9:15 below an
  // unrelated paragraph when the reader had selected 9:14-16.
  const last = Math.max(verse, verseEnd ?? verse);
  const tokens = tokenize(query);
  const hits = paragraphs
    .map((p) => {
      if (isBoilerplate(p) || !isSubstantiveQuote(p)) return { p, score: 0 };
      const lower = p.toLowerCase();
      let score = 0;
      for (const t of tokens) if (lower.includes(t)) score += 1;
      for (let v = verse; v <= last; v++) {
        if (paragraphMentionsVerse(p, chapter, v)) {
          score += 6;
          break;
        }
      }
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);

  if (hits.length) return hits;
  return pickParagraphs(paragraphs, query, limit);
}

export function pickParagraphs(
  paragraphs: string[],
  query: string,
  limit = 4,
): string[] {
  const tokens = tokenize(query);
  if (!tokens.length) {
    return paragraphs
      .filter((p) => !isBoilerplate(p) && isSubstantiveQuote(p))
      .slice(0, limit);
  }
  const hits = paragraphs
    .map((p) => {
      if (isBoilerplate(p) || !isSubstantiveQuote(p)) return { p, score: 0 };
      const lower = p.toLowerCase();
      let score = 0;
      for (const t of tokens) if (lower.includes(t)) score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);

  if (!hits.length) {
    return paragraphs
      .filter((p) => !isBoilerplate(p) && isSubstantiveQuote(p))
      .slice(0, limit);
  }
  return hits;
}
