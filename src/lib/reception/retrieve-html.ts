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

  // Prefer a cut in the upper half of the window. Gill's BibleHub notes open
  // with "lemma...." then one short sentence and a long semicolon run; an
  // early period must not collapse a 7k-char note to ~120 chars when the cap
  // is 2200 (paragraphsFromHtml keep-long path).
  const preferFrom = Math.max(120, Math.floor(maxLen * 0.5));

  const sentenceMatches = Array.from(trimmed.matchAll(/[.!?](?=\s|$)/g));
  let bestCut = -1;
  let earlyCut = -1;
  for (const m of sentenceMatches) {
    const end = (m.index ?? 0) + 1;
    if (end > maxLen) continue;
    if (end >= preferFrom) bestCut = end;
    else if (end >= 120) earlyCut = end;
  }

  if (bestCut > 0) {
    return trimmed.slice(0, bestCut).trim();
  }

  const clauseMatches = Array.from(trimmed.matchAll(/[;:][\s]/g));
  for (const m of clauseMatches) {
    const end = (m.index ?? 0) + 1;
    if (end <= maxLen && end >= preferFrom) {
      bestCut = end;
    }
  }
  if (bestCut > 0) {
    return trimmed.slice(0, bestCut).trim() + "\u2026";
  }

  const lastSpace = trimmed.lastIndexOf(" ", maxLen);
  if (lastSpace > preferFrom) {
    return trimmed.slice(0, lastSpace).trim() + "\u2026";
  }

  if (earlyCut > 0) {
    return trimmed.slice(0, earlyCut).trim();
  }

  if (lastSpace > 60) {
    return trimmed.slice(0, lastSpace).trim() + "\u2026";
  }

  return trimmed.slice(0, maxLen).trim() + "\u2026";
}


/** EN + ES book forms used to detect verse-ref token spam in card bodies. */
const VERSE_REF_BOOK =
  "Genesis|G[eé]nesis|Exodus|[EÉ]xodo|Leviticus|Lev[ií]tico|Numbers|N[uú]meros|Deuteronomy|Deuteronomio|Joshua|Josu[eé]|Judges|Jueces|Ruth|Rut|Samuel|Kings|Reyes|Chronicles|Cr[oó]nicas|Ezra|Esdras|Nehemiah|Nehem[ií]as|Esther|Ester|Job|Psalms?|Salmos?|Proverbs|Proverbios|Ecclesiastes|Eclesiast[eé]s|Song of Solomon|Song of Songs|Cantares|Isaiah|Isa[ií]as|Jeremiah|Jerem[ií]as|Lamentations|Lamentaciones|Ezekiel|Ezequiel|Daniel|Hosea|Oseas|Joel|Amos|Am[oó]s|Obadiah|Abd[ií]as|Jonah|Jon[aá]s|Micah|Miqueas|Nahum|Nah[uú]m|Habakkuk|Habacuc|Zephaniah|Sofon[ií]as|Haggai|Hageo|Zechariah|Zacar[ií]as|Malachi|Malaqu[ií]as|Matthew|Mateo|Mark|Marcos|Luke|Lucas|John|Juan|Acts|Hechos|Romans|Romanos|Corinthians|Corintios|Galatians|G[aá]latas|Ephesians|Efesios|Philippians|Filipenses|Colossians|Colosenses|Thessalonians|Tesalonicenses|Timothy|Timoteo|Titus|Tito|Philemon|Filem[oó]n|Hebrews|Hebreos|James|Santiago|Peter|Pedro|Jude|Judas|Revelation|Apocalipsis|Apocalypse";

/** Named book + chapter:verse (optional ordinal prefix, optional verse range). */
const NAMED_VERSE_REF = new RegExp(
  String.raw`\b(?:(?:1|2|3)\s+)?(?:${VERSE_REF_BOOK})\.?\s+\d{1,3}\s*:\s*\d{1,3}(?:\s*[-–]\s*\d{1,3})?\b`,
  "gi",
);

const BARE_CHAPTER_VERSE = /\b\d{1,3}\s*:\s*\d{1,3}\b/g;

/**
 * True when a body is mostly concatenated verse-ref tokens
 * ("John 1:1 John 1:2 …" / "Juan 1:1 Juan 1:2 …") rather than commentary prose.
 * Used in EN and ES QC so neither locale ships ref-spam GENERADA cards.
 */
export function isMostlyVerseRefs(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;

  const namedRe = new RegExp(NAMED_VERSE_REF.source, "gi");
  const bareRe = new RegExp(BARE_CHAPTER_VERSE.source, "g");
  const named = [...trimmed.matchAll(namedRe)];
  const bare = [...trimmed.matchAll(bareRe)];
  if (named.length < 2 && bare.length < 4) return false;

  const refChars = named.reduce((n, m) => n + m[0].length, 0);
  const prose = trimmed
    .replace(new RegExp(NAMED_VERSE_REF.source, "gi"), " ")
    .replace(new RegExp(BARE_CHAPTER_VERSE.source, "g"), " ")
    .replace(/[|·•,;./\-–—]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const proseWords = prose
    .split(/\s+/)
    .filter((w) => w.length > 1 && !/^\d+$/.test(w));

  if (named.length >= 3 && proseWords.length < named.length * 2) return true;
  if (named.length >= 2 && refChars / trimmed.length >= 0.45) return true;
  if (named.length >= 3 && prose.length < 40) return true;
  if (bare.length >= 5 && proseWords.length < 8) return true;
  return false;
}

export function isSubstantiveQuote(text: string): boolean {
  if (isBoilerplate(text) || isEmbeddedScripture(text)) return false;
  if (isMostlyVerseRefs(text)) return false;
  const trimmed = text.trim();
  if (trimmed.length < 15) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;
  // Letter-outline theses ("a) The Word is not a creature") are a treatise
  // contents list, not a verse lemma. They used to win John 1:1 because
  // "Word" overlaps the verse.
  if (/^[a-z](?:\)|\.)\s/i.test(trimmed)) return false;
  return true;
}

export function paragraphsFromHtml(html: string): string[] {
  // BibleHub chapter pages put the verse ref in .versenum and the lemma in
  // .verse. Emit only the ref as a short pending label so the following
  // commentary paragraph inherits "Romans 8:28" — not a separate lemma-only
  // chunk that later merges into a neighbour via unclosed <p> tags.
  const withHubLabels = html.replace(
    /<div\b[^>]*class=["'][^"']*versenum[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<div\b[^>]*class=["'][^"']*verse[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi,
    (_m, numHtml: string, _verseHtml: string) =>
      // Force-close prior unclosed Hub <p> runs so the ref is its own short
      // chunk (pendingLabel), then open a fresh paragraph for the note.
      `</p></div><p>${numHtml}</p><p>`,
  );
  const clean = sanitizeHtml(withHubLabels);
  const chunks = clean.split(/<\/p>|<br\s*\/?>|<\/div>|<\/h[1-6]>/i);
  const out: string[] = [];
  const seen = new Set<string>();
  let pendingLabel = "";
  for (const chunk of chunks) {
    let text = htmlToText(chunk);
    const trimmed = text.trim();
    // Orphan Hub / CCEL verse headings that did not match the paired rewrite.
    if (
      trimmed.length < 80 &&
      /^(?:(?:[1-3]\s*)?[A-Za-z][A-Za-z.]+(?:\s+[A-Za-z][A-Za-z.]+){0,2}\s+)?\d{1,3}:\d{1,3}\s*$/.test(trimmed)
    ) {
      pendingLabel = trimmed;
      continue;
    }
    if (pendingLabel) {
      text = `${pendingLabel}. ${text}`.trim();
      pendingLabel = "";
    }
    if (text.length < 80) continue;
    if (text.length > 2200) {
      text = truncateAtSentence(text, 2200);
    }
    if (text.length < 80 || isBoilerplate(text) || !isSubstantiveQuote(text)) continue;
    const key = text.slice(0, 80).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
}

/**
 * True when a paragraph announces the target verse. Real label shapes from
 * BibleHub, bibliaplus, CCEL, New Advent and Tertullian: a leading verse
 * number, "Ver./Verse/Vs./v./vv." labels, a heading chapter:verse (with or
 * without a book name), or parenthetical verse markers at the open. Ranges
 * ("Ver. 6-13", "9:6-13") count when the target falls inside them.
 * Mid-paragraph cross-references ("see Romans 8:28") do NOT count — those
 * are how neighbour notes used to outrank the target.
 */
export function paragraphMentionsVerse(
  text: string,
  chapter: number,
  verse: number,
): boolean {
  const trimmed = text.trim();

  // "(28)" / "[28]" / "(8)" — parenthetical verse numbers these hosts print.
  const leadParen = /^(?:[\(\[]\s*)(\d{1,3})\s*[)\]]/.exec(trimmed);
  if (leadParen && Number(leadParen[1]) === verse) return true;

  // "11. Though they were not yet born..." / "11:" / "11—"
  // Two-digit lemmas are the Calvin/Henry shape. A single-digit "1." is
  // usually a treatise section (Cyril's outline on John 1), not verse 1.
  // "8:" (colon) is still a verse heading.
  const lead = /^(\d{1,3})(?:\s*([.:])|\s*[-\u2013\u2014])/.exec(trimmed);
  if (lead && Number(lead[1]) === verse) {
    if (verse >= 10) return true;
    if (lead[2] === ":") return true;
  }

  // "Ver. 11", "Verse 11", "Verses 9-13", "Vs. 11", "v. 11", "vv. 9-13"
  // at the paragraph open only — mid-note "see ver. 3" / "From verse 3 to
  // the 10th" must not make a neighbour treat the target.
  // No book-name prefix here — "From verse 3" must not look like "Ver. 3".
  const labelledHead =
    /^(?:ver(?:s|se|ses)?|vs|vv?)\.?\s*(\d{1,3})(?:\s*[-\u2013\u2014]\s*(\d{1,3}))?\b/i.exec(
      trimmed,
    );
  if (labelledHead) {
    const start = Number(labelledHead[1]);
    const end = labelledHead[2] ? Number(labelledHead[2]) : start;
    if (verse >= start && verse <= Math.max(start, end)) return true;
  }

  // Heading-only chapter:verse — "Romans 8:28. And we know…", "Matt. 5:3 Blessed…",
  // "8:28 And we know…". Must sit at the paragraph open (optional book name),
  // not mid-note as a cross-reference.
  const heading = new RegExp(
    `^(?:(?:[1-3]\\s*)?[A-Za-z][A-Za-z]+\\.?\\s+)?${chapter}:(\\d{1,3})(?:\\s*[-\\u2013\\u2014]\\s*(\\d{1,3}))?\\b`,
  );
  const hm = heading.exec(trimmed);
  if (hm) {
    const start = Number(hm[1]);
    const end = hm[2] ? Number(hm[2]) : start;
    if (verse >= start && verse <= Math.max(start, end)) return true;
  }

  return false;
}

/**
 * BibleHub Gill notes open "Lemma text,.... Commentary…". When the lemma
 * matches the verse query and real commentary follows the ellipsis, treat
 * that paragraph as on-target (same weight as a Ver./ch:vs marker).
 */
export function paragraphIsGillLemmaNote(text: string, query: string): boolean {
  if (!query.trim()) return false;
  const trimmed = text.trim();
  const m = /^(.{15,220}?),\.{3,}(?=\s)/.exec(trimmed);
  if (!m) return false;
  const after = trimmed.slice(m[0].length).trim();
  if (after.length < 40) return false;
  const lemmaToks = tokenize(m[1]);
  const qToks = new Set(tokenize(query));
  if (lemmaToks.length < 3 || qToks.size < 2) return false;
  let hits = 0;
  for (const t of lemmaToks) if (qToks.has(t)) hits += 1;
  if (hits < Math.min(3, lemmaToks.length)) return false;
  // Early lemma tokens must also land in the query — shared theological
  // vocabulary ("God", "Son", "world") must not let a neighbour Gill note win.
  const early = lemmaToks.slice(0, Math.min(4, lemmaToks.length));
  let earlyHits = 0;
  for (const t of early) if (qToks.has(t)) earlyHits += 1;
  return earlyHits >= Math.min(3, early.length);
}

/**
 * True when the paragraph opens with the early distinctive tokens of the
 * selected verse text. Shared beatitude endings ("kingdom of heaven") must
 * not make Matt 5:10 look like Matt 5:3 — only the first few content tokens.
 */
export function paragraphOpensWithVerseLemma(text: string, query: string): boolean {
  const qToks = tokenize(query);
  if (qToks.length < 3) return false;
  const need = qToks.slice(0, Math.min(4, qToks.length));
  // Strip a leading verse heading so "Romans 8:28. And we know…" still matches.
  const head = text
    .trim()
    .replace(
      /^(?:(?:[1-3]\s*)?[A-Za-z][A-Za-z]+\.?\s+)?\d{1,3}:\d{1,3}(?:\s*[-\u2013\u2014]\s*\d{1,3})?\.?\s+/,
      "",
    )
    .replace(/^(?:[\(\[]\s*)?\d{1,3}\s*[.:)\]]\s+/, "")
    .slice(0, 160);
  const headToks = tokenize(head).slice(0, need.length + 1);
  if (headToks.length < 2) return false;
  let hits = 0;
  for (const t of need) if (headToks.includes(t)) hits += 1;
  // Opening tokens of the note must be the verse's opening tokens —
  // "in the beginning" in a later clause must not make a thesis treat 1:1.
  return hits >= Math.min(3, need.length);
}

/** Verse ref, Gill lemma, or Hub opening-lemma — the extract treats this verse. */
export function paragraphTreatsVerse(
  text: string,
  chapter: number | undefined,
  verse: number | undefined,
  query: string,
  verseEnd?: number | null,
): boolean {
  if (chapter != null && verse != null) {
    const last = Math.max(verse, verseEnd ?? verse);
    for (let v = verse; v <= last; v++) {
      if (paragraphMentionsVerse(text, chapter, v)) return true;
    }
    // "Romans 8:31. …" must not treat 8:28 via a loose lemma/token match.
    if (paragraphNamesOtherVerse(text, chapter, verse, last)) return false;
  }
  if (paragraphIsGillLemmaNote(text, query)) return true;
  return paragraphOpensWithVerseLemma(text, query);
}

/** True when the paragraph opens by naming a different verse in this chapter. */
function paragraphNamesOtherVerse(
  text: string,
  chapter: number,
  verseStart: number,
  verseEnd: number,
): boolean {
  const trimmed = text.trim();
  const heading = new RegExp(
    `^(?:(?:[1-3]\\s*)?[A-Za-z][A-Za-z]+\\.?\\s+)?${chapter}:(\\d{1,3})(?:\\s*[-\\u2013\\u2014]\\s*(\\d{1,3}))?\\b`,
  );
  const hm = heading.exec(trimmed);
  if (hm) {
    const start = Number(hm[1]);
    const end = hm[2] ? Number(hm[2]) : start;
    return end < verseStart || start > verseEnd;
  }
  const lead = /^(?:[\(\[]\s*)?(\d{1,3})(?:\s*[.:)\]]|\s*[-\u2013\u2014])/.exec(trimmed);
  if (lead) {
    const v = Number(lead[1]);
    return v < verseStart || v > verseEnd;
  }
  // "Ver. 31" / "Verse 29" heading for a neighbour.
  const labelled =
    /^(?:\s*)(?:ver(?:s|se|ses)?|vs|vv?)\.?\s*(\d{1,3})(?:\s*[-\u2013\u2014]\s*(\d{1,3}))?/i.exec(
      trimmed,
    );
  if (labelled) {
    const start = Number(labelled[1]);
    const end = labelled[2] ? Number(labelled[2]) : start;
    return end < verseStart || start > verseEnd;
  }
  return false;
}

function paragraphLooksVerseLabeled(text: string, chapter?: number): boolean {
  const trimmed = text.trim();
  if (/^(?:[\(\[]\s*)?\d{1,3}(?:\s*[.:)\]]|\s*[-\u2013\u2014])/.test(trimmed)) {
    return true;
  }
  if (/\b(?:ver(?:s|se|ses)?|vs|vv?)\.?\s*\d{1,3}/i.test(trimmed)) return true;
  // Heading "Romans 8:28" / "8:28" at the open (not a mid-note cross-ref).
  if (
    chapter != null &&
    new RegExp(
      `^(?:(?:[1-3]\\s*)?[A-Za-z][A-Za-z]+\\.?\\s+)?${chapter}:\\d{1,3}\\b`,
    ).test(trimmed)
  ) {
    return true;
  }
  // Gill / Hub lemma notes open "Lemma text,...." — treat as verse-structured
  // so a page of neighbour lemmas does not fall back to token scoring.
  if (/^.{15,220}?,\.{3,}(?=\s)/.test(trimmed)) return true;
  return false;
}

/**
 * Paragraph selection that knows which verse it is looking for. A page can
 * cover a whole chapter (Henry) or a neighbouring pericope (Calvin on CCEL is
 * split by pericope, so a chapter-level row can land on the wrong page); the
 * marker bonus keeps the lemma paragraph ahead of a merely word-similar one.
 * When verse-true hits exist, drop neighbours. Falls back to token scoring
 * only when the page has no verse labels at all.
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
  const tokens = tokenize(query);
  const scored = paragraphs
    .map((p) => {
      if (isBoilerplate(p) || !isSubstantiveQuote(p)) {
        return { p, score: 0, treats: false };
      }
      const lower = p.toLowerCase();
      let score = 0;
      for (const t of tokens) if (lower.includes(t)) score += 1;
      const treats = paragraphTreatsVerse(p, chapter, verse, query, verseEnd);
      if (treats) score += 6;
      return { p, score, treats };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const treated = scored.filter((x) => x.treats).slice(0, limit).map((x) => x.p);
  if (treated.length) return treated;

  // Page has verse labels for neighbours but none for the target — drop rather
  // than surfacing a Matt 5:10 note for Matt 5:3.
  if (paragraphs.some((p) => paragraphLooksVerseLabeled(p, chapter))) {
    return [];
  }

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