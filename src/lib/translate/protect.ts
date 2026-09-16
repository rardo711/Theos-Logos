/**
 * Protect spans Google Translate must not rewrite: verse refs, Greek/Hebrew,
 * Strong's ids, URLs, and named voices. Uses HTML markers the NMT engine
 * respects (`translate="no"` / class="notranslate").
 */

const NOOPEN = '<span class="notranslate" translate="no">';
const NOCLOSE = "</span>";

const BOOK_EN =
  "Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Song of Songs|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation";

const BOOK_ABBR =
  "Gen|Exod|Ex|Lev|Num|Deut|Josh|Judg|Ruth|Sam|Kgs|Chr|Ezr|Neh|Esth|Job|Ps|Prov|Eccl|Cant|Isa|Jer|Lam|Ezek|Dan|Hos|Joel|Amos|Obad|Jonah|Mic|Nah|Hab|Zeph|Hag|Zech|Mal|Matt|Mt|Mk|Lk|Jn|Acts|Rom|Cor|Gal|Eph|Phil|Col|Thess|Tim|Tit|Phlm|Heb|Jas|Pet|Jude|Rev";

/** English + common abbreviations with chapter:verse. */
const VERSE_REF = new RegExp(
  `\\b(?:(?:1|2|3)\\s*)?(?:${BOOK_EN}|${BOOK_ABBR})\\.?\\s+\\d{1,3}:\\d{1,3}(?:\\s*[-–]\\s*\\d{1,3})?\\b`,
  "gi",
);

const STRONGS = /\b[GH]\d{1,5}\b/g;
const URL = /https?:\/\/[^\s<>"')\]]+/gi;
/** Greek (incl. polytonic) and Coptic blocks commonly seen in NT notes. */
const GREEK = /[\u0370-\u03FF\u1F00-\u1FFF]+/g;
/** Hebrew + presentation forms. */
const HEBREW = /[\u0590-\u05FF\uFB1D-\uFB4F]+/g;

export type ProtectResult = {
  html: string;
  /** Original protected substrings, in order of placeholder index. */
  tokens: string[];
};

/**
 * Wrap protected spans so NMT leaves them intact. Callers that need plain text
 * after translation should run {@link unwrapProtected}.
 */
export function protectForTranslate(
  text: string,
  extraLiterals: string[] = [],
): ProtectResult {
  if (!text) return { html: "", tokens: [] };
  const tokens: string[] = [];
  const stash = (raw: string): string => {
    const i = tokens.length;
    tokens.push(raw);
    return `${NOOPEN}${raw}${NOCLOSE}`;
  };

  let out = text;

  // Longest extras first so "John Calvin" wins over "John".
  const extras = [...new Set(extraLiterals.map((s) => s.trim()).filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );
  for (const lit of extras) {
    if (!lit || lit.length < 2) continue;
    const re = new RegExp(escapeRe(lit), "g");
    out = out.replace(re, (m) => stash(m));
  }

  out = out.replace(URL, (m) => stash(m));
  out = out.replace(VERSE_REF, (m) => stash(m));
  out = out.replace(STRONGS, (m) => stash(m));
  out = out.replace(GREEK, (m) => stash(m));
  out = out.replace(HEBREW, (m) => stash(m));

  return { html: out, tokens };
}

export function unwrapProtected(html: string): string {
  if (!html) return "";
  return html
    .replace(/<span\b[^>]*\bclass="notranslate"[^>]*>([\s\S]*?)<\/span>/gi, "$1")
    .replace(/<span\b[^>]*\btranslate="no"[^>]*>([\s\S]*?)<\/span>/gi, "$1")
    // Strip any residual tags Google may emit.
    .replace(/<\/?[^>]+>/g, "");
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * True when the haystack is essentially the English verse (or a trivial
 * wrapper), so we should prefer Spanish scripture over machine translation.
 */
export function isPrimarilyScripture(
  quote: string,
  verseTextEn: string | undefined,
): boolean {
  if (!quote || !verseTextEn) return false;
  const norm = (s: string) =>
    s
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  const q = norm(quote);
  const v = norm(verseTextEn);
  if (!q || !v || v.length < 12) return false;
  if (q === v) return true;
  // Quote is verse plus a short gloss / ellipsis wrapper.
  if (q.includes(v) && q.length <= v.length + 40) return true;
  return false;
}
