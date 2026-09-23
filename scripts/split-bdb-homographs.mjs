#!/usr/bin/env node
/**
 * Build compact Hebrew lexicon from unabridged BDB (Brown-Driver-Briggs, 1906),
 * with homograph sections SPLIT into separate entries.
 *
 * Source: https://github.com/primekoboo-bibleresources/unabridged-bdb-hebrew-lexicon
 * (CSV with Strong's number mapping; "Public domain document" per its README;
 * BDB itself is 1906, public domain.)
 *
 * Run locally / on the box — DO NOT download at Vercel build.
 * Outputs: src/lib/lexicon/data/hebrew-bdb.json
 *
 * This supersedes import-bdb-he-lexicon.mjs's mergeParses(): where several BDB
 * rows claim one Strong's number (BDB's I./II./III. homograph sections), each
 * row is now emitted as its OWN entry instead of being merged. The winner row
 * keeps the canonical H#### key; further rows become H####b/c/… in BDB row
 * order. All wording stays verbatim BDB — the split is the exact inverse of
 * the old merge, and every non-winner head now ships whole (the old merged
 * head silently truncated non-winner heads at the 600-char cap).
 *
 * Each entry also carries `sd`: the concise definition from Strong's Hebrew
 * Dictionary (1890, public domain) via openscriptures/strongs. On split
 * entries the card lets a verse-matched BDB sense outrank `sd` (showing
 * Strong's "to create" on the "be fat" lexeme would reproduce the bug being
 * fixed); `sd` itself is still shipped verbatim under its own attribution.
 *
 * Fidelity rules (Gerardo's standing condition: faithful to the original lexicon):
 * 1. PRIMARY — BDB HTML entries keyed by Strong's (H####). One H-number is often
 *    claimed by several BDB rows: homograph sections (I./II./III. under one
 *    headword), "see X" cross-ref stubs, Biblical Aramaic appendix rows, and
 *    "mentioned-in" rows. Rows are re-parsed independently and emitted per the
 *    row-kind rules below; wording is never paraphrased or regenerated.
 *    Row-kind rules for non-winner rows (winner row always ships as primary):
 *    - substantive rows (≥1 sense div) → own split entry, always safe;
 *    - head-only rows with verse refs (proper names etc.) → own split entry,
 *      the head (+ its refs) becomes ss[0];
 *    - pure "see below/q.v." stubs → dropped (matches the importer's existing
 *      stub rule), traceable via the primary's `droppedStubs`;
 *    - head-only rows without refs and without a see-pattern → own split
 *      entry flagged `"stub": true` (keeps the gloss routable);
 *    - rows that are another H-number's WINNING row → NOT duplicated; the
 *      primary carries a `seeAlso` pointer instead (verse routing then
 *      follows Strong's tagging).
 *    Within-row sections are never auto-split: rows with sense-numbering
 *    resets or multiple head paragraphs keep their sections together and are
 *    flagged `"needsReview": true` with a reason.
 * 2. Markup is stripped to plain text; the wording stays verbatim. Very long
 *    entries are truncated at a per-entry budget (earliest senses kept whole) —
 *    truncation only, never rewriting.
 * 3. Verse refs come from the structured <ref b cBegin vBegin cEnd vEnd>
 *    attributes (SBL book numbering: 1=Gen … 39=Mal) so the card can pick the
 *    sense cited for the verse being read. Each split carries ONLY its own
 *    row's refs — the old round-robin merged refs from other lexemes (e.g.
 *    H1106 carrying Gen 14:2/14:8 that belong to the place-name lexeme).
 * 4. Biblical Aramaic appendix entries are included; they share the H-number
 *    range and are flagged lang:"aramaic" from the entry's own section label.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src/lib/lexicon/data");
const RESEARCH = join(ROOT, "..", "bdb-hebrew-research");

const CSV_ZIP_URL =
  "https://github.com/primekoboo-bibleresources/unabridged-bdb-hebrew-lexicon/raw/master/unabridged-BDB-Hebrew-lexicon.csv.zip";
const SOURCE_URL =
  "https://github.com/primekoboo-bibleresources/unabridged-bdb-hebrew-lexicon";
const ATTRIBUTION = "Brown-Driver-Briggs Hebrew Lexicon (1906), public domain.";

// Strong's concise Hebrew definitions, merged per entry as `sd`.
// Source: openscriptures/strongs, hebrew/StrongHebrewG.xml — a digitization
// of Strong's Hebrew Dictionary (James Strong, "The Exhaustive Concordance
// of the Bible", 1890; public domain). Same fetch-once-locally pattern as
// the BDB CSV above: never downloaded at Vercel build.
const STRONGS_XML_URL =
  "https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/StrongHebrewG.xml";
const STRONGS_SOURCE_URL = "https://github.com/openscriptures/strongs";
const STRONGS_ATTRIBUTION = "Strong's Hebrew Dictionary (1890), public domain.";

// Size caps: the median BDB entry ships whole; only the long tail is trimmed
// (earliest senses first, so the common meanings are never cut).
const HEAD_CAP = 600;
const SENSE_CAP = 900;
const MAX_SENSES = 14;
const REF_CAP = 8; // per sense-div; the head sense keeps all its refs (uncapped)
const ENTRY_BUDGET = 5000;

function normalizeStrongs(raw) {
  const m = String(raw ?? "")
    .toUpperCase()
    .match(/H\s*0*(\d+)/);
  // H0 is a placeholder (the א alphabet article), not a real Strong's number.
  return m && m[1] !== "0" ? `H${m[1]}` : "";
}

async function loadCsv() {
  const local = join(RESEARCH, "unabridged-BDB-Hebrew-lexicon.csv");
  try {
    const text = await readFile(local, "utf8");
    process.stderr.write(`  using local ${local}\n`);
    return text;
  } catch {
    process.stderr.write(`  fetching ${CSV_ZIP_URL}\n`);
    const res = await fetch(CSV_ZIP_URL, {
      headers: { "User-Agent": "Theos-Logos BDB importer (public domain)" },
    });
    if (!res.ok) throw new Error(`${res.status} ${CSV_ZIP_URL}`);
    const buf = Buffer.from(await res.arrayBuffer());
    // The CSV ships zipped; unzip -p streams the single member to stdout.
    const { stdout } = await execFileAsync("unzip", ["-p", "-", "*.csv"], {
      input: buf,
      maxBuffer: 128 * 1024 * 1024,
      encoding: "buffer",
    });
    return stdout.toString("utf8");
  }
}

/** The TSV is clean: no tabs/newlines inside fields, so a simple split works. */
function parseTsv(text) {
  const lines = text.split(/\r?\n/);
  const header = lines[0].split("\t");
  if (header[0] !== "BDBid") throw new Error("unexpected CSV header");
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = line.split("\t");
    if (cols.length < 3) continue;
    rows.push({ id: cols[0], strong: cols[1], html: cols.slice(2).join("\t") });
  }
  return rows;
}

function stripTags(t) {
  return t
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&emsp;|&ensp;|&thinsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // BDB itself uses < ... > brackets for conjectural readings ("< read",
    // "< strike out" — 230+ occurrences in the source); those are real
    // scholarly content and must be kept as literal text. Only the
    // digitization pipeline's metadata artifacts are stripped here:
    // <TOPIC:...>, <BIBLE:...>, <Times New Roman>, and the mangled
    // >BIBLE:...> variant (same family, corrupted opening bracket).
    .replace(/<(TOPIC|BIBLE):[^<>]*>/g, " ")
    .replace(/<Times New Roman>/g, " ")
    .replace(/>BIBLE:[^<>]*>/g, " ")
    .replace(/[ \t ]+/g, " ");
}

const REF_RE = /<ref\s+([^>]*)>(.*?)<\/ref>/gs;

function parseRefAttrs(attr) {
  const d = {};
  for (const m of attr.matchAll(/(\w+)="([^"]*)"/g)) d[m[1]] = m[2];
  const num = (v, fb) => {
    const n = parseInt(v ?? "", 10);
    return Number.isFinite(n) ? n : fb;
  };
  const b = num(d.b, 0);
  const c1 = num(d.cBegin, 0);
  const v1 = num(d.vBegin, 0);
  if (!b || !c1 || !v1) return null;
  return { b, c1, v1, c2: num(d.cEnd, c1), v2: num(d.vEnd, v1) };
}

/** "1.1.1" for a single verse, "1.1.1-1.31" for a range (SBL book numbers). */
/**
 * SIL verse key BBBCCCVVV, matching referenceToSilVerseKey() in spanish.ts
 * (which english.ts also uses). Range refs store their start verse.
 */
function refKey(r) {
  const bbb = String(r.b).padStart(3, "0");
  const ccc = String(r.c1).padStart(3, "0");
  const vvv = String(r.v1).padStart(3, "0");
  return `${bbb}${ccc}${vvv}`;
}

/**
 * Cap text at a word boundary so we never ship a half-word. An ellipsis
 * marks that BDB has more (the entry was over budget).
 */
function capText(text, cap) {
  if (text.length <= cap) return text;
  let cut = text.lastIndexOf(" ", cap);
  if (cut < cap * 0.5) cut = text.lastIndexOf("\n", cap);
  if (cut < cap * 0.5) cut = cap;
  return text.slice(0, cut).trimEnd() + " …";
}

/**
 * Strip markup only. Verse <ref> tags keep their display text ("Gen 1:3");
 * the structured refs are returned separately for verse-aware sense picking.
 */
function cleanText(t) {
  let out = t.replace(REF_RE, (_m, _attrs, inner) => ` ${inner} `);
  out = out.replace(/<hr\s*\/?>/gi, " ¶ ");
  // Drop interactive/formatting wrappers but keep their inner text.
  out = out.replace(
    /<\/?(entry|lookup|reflink|highlightword|highlight|transliteration|bdbheb|bdbare|heb|aramaic|sup|sub|i|b|p|div|span|a|placeholder\d+)[^>]*>/gi,
    " ",
  );
  out = out.replace(/<[^>]+>/g, " ");
  out = stripTags(out)
    // BDB's sub-sense divider "<br>\&emsp;\&emsp;\&emsp;" survives tag
    // stripping as literal backslash runs (" \ \ \ "); normalize to a
    // readable separator instead of shipping visible artifacts.
    .replace(/(?:\s*\\)+/g, " · ")
    .replace(/\s*¶\s*/g, "\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return out;
}

/**
 * BDB highlights grammatical labels (conjugations, stems, number/gender)
 * that are not meanings. When an entry has no <highlightword>, these are
 * skipped while picking a fallback headword gloss.
 */
const GRAMMATICAL = new Set(
  (
    "perfect imperfect infinitive participle imperative jussive cohortative " +
    "gerund piel pual hiphil hophal niphal qal hithpael plural singular dual " +
    "masculine feminine"
  ).split(" "),
);

/** True when a highlighted gloss looks like a meaning, not grammar. */
function isMeaningGloss(g) {
  const k = String(g).toLowerCase().trim();
  if (k.length < 2 || k === "a" || k === "an" || k === "the") return false;
  if (/^[a-z]\.?$/.test(k)) return false; // sense labels like "a", "b."
  return !GRAMMATICAL.has(k);
}

function isCrossrefNote(t) {
  return (
    /^\[/.test(t) && (/[0-9]+:[0-9]/.test(t) || /[\u0590-\u05ea]/.test(t))
  );
}

/**
 * BDB cross-references senses with bold labels ("see also אֵל 3. בַּעַל 4.",
 * "1.", "a.", "II.", "2 b"). Those are not parts of speech and must never
 * ship as the entry's POS (H1276 shipped pos "3."; 14 other entries shipped
 * bare sense labels like "1." or "a." instead of their real POS).
 */
function isSenseLabel(t) {
  return /^([a-z]+\.|[a-z]?\d+\s?[a-z]?\.?)$/i.test(t);
}

/** A <b> qualifies as a part-of-speech candidate. */
function isPosCandidate(t) {
  return !isCrossrefNote(t) && !isSenseLabel(t);
}

/**
 * The article's head paragraph: the first <p> with a Hebrew headword that
 * reads like a real entry head (carries a POS <b> or a highlighted gloss).
 * Skips section prefaces ("[ Dan 2:4-7:28 … ]", "NOTE. …") and "see X"
 * cross-reference stubs — e.g. BDB9264 leads with the Biblical Aramaic
 * preface and an אָב stub before the real אֵב 'fruit' article (H4).
 * Falls back to the first <p> when no paragraph qualifies (old behavior).
 */
function headBlock(c) {
  const blocks = [...c.matchAll(/<p>(.*?)<\/p>/gs)].map((m) => m[1]);
  const hasHeadword = (h) => {
    for (const m of h.matchAll(/<(bdbheb|bdbarc|bdbare|heb)>(.*?)<\/\1>/gs)) {
      if (/[\u0590-\u05ea]/.test(stripTags(m[2]))) return true;
    }
    return false;
  };
  const hasPosOrGloss = (h) => {
    if (/<highlightword>/.test(h)) return true;
    for (const m of h.matchAll(/<b>(.*?)<\/b>/gs)) {
      if (isPosCandidate(stripTags(m[1]).trim())) return true;
    }
    return false;
  };
  for (const h of blocks) if (hasHeadword(h) && hasPosOrGloss(h)) return h;
  return blocks[0] ?? "";
}

function parseEntry(html) {
  // Drop the <h1> title and prev/next navigation chrome.
  let c = html.replace(/<h1>.*?<\/h1>/gs, " ");
  c = c.replace(/<div class="navigation">.*?<\/div>/gs, " ");
  const navMatch = html.match(/<div class="navigation">(.*?)<\/div>/s);
  const aramaic = /BIBLICAL ARAMAIC/.test(navMatch ? navMatch[1] : "");

  const headHtml = headBlock(c);

  // Lemma: first headword tag containing Hebrew letters. Skips footnote
  // markers like <bdbheb><reflink>ᵑ7</reflink></bdbheb> and covers the
  // Aramaic <bdbarc> spelling.
  let lemma = "";
  for (const m of headHtml.matchAll(
    /<(bdbheb|bdbarc|bdbare|heb)>(.*?)<\/\1>/gs,
  )) {
    const t = stripTags(m[2]).trim();
    if (/[\u0590-\u05ea]/.test(t)) {
      // Trim after slicing: a slice cut at a space would otherwise leave
      // trailing whitespace in the shipped lemma.
      lemma = t.slice(0, 60).trim();
      break;
    }
  }
  // POS: first <b> that is not a bracketed cross-reference note
  // (e.g. <b>[Dan 2:4 …]</b> or <b>[ מָהַר ]</b>), which some heads lead with.
  let pos = "";
  for (const m of headHtml.matchAll(/<b>(.*?)<\/b>/gs)) {
    const t = stripTags(m[1]).trim();
    if (!isPosCandidate(t)) {
      continue; // cross-reference note or bare sense label, not a part of speech
    }
    // Trim after slicing: a slice cut at a space would otherwise leave
    // trailing whitespace in the shipped POS (seen on H4601/H4714).
    pos = t.slice(0, 40).trim();
    break;
  }
  const occMatch = headHtml.match(/<sub>(\d+)<\/sub>/);
  const occ = occMatch ? parseInt(occMatch[1], 10) : 0;
  const hwMatch = headHtml.match(/<highlightword>(.*?)<\/highlightword>/s);
  let hw = hwMatch ? stripTags(hwMatch[1]).trim().slice(0, 80).trim() : "";

  const headRefs = [];
  for (const m of headHtml.matchAll(REF_RE)) {
    const r = parseRefAttrs(m[1]);
    if (r) headRefs.push(r);
  }

  // Senses are the <div class="point|section|remarks"> blocks, in BDB order.
  const senses = [];
  for (const m of c.matchAll(
    /<div class="(point|section|remarks)">(.*?)<\/div>/gs,
  )) {
    const sHtml = m[2];
    const glosses = [];
    for (const g of sHtml.matchAll(/<highlight>(.*?)<\/highlight>/gs)) {
      const text = stripTags(g[1]).trim();
      if (text && text.length <= 60 && !glosses.includes(text)) {
        glosses.push(text);
        if (glosses.length >= 6) break;
      }
    }
    const refs = [];
    for (const r of sHtml.matchAll(REF_RE)) {
      const parsed = parseRefAttrs(r[1]);
      if (parsed) {
        refs.push(parsed);
        if (refs.length >= 24) break;
      }
    }
    const text = cleanText(sHtml);
    if (text) senses.push({ text, glosses, refs });
  }

  if (!hw) {
    // No highlighted headword: use the first meaning-like gloss in BDB order.
    for (const s of senses) {
      const g = s.glosses.find(isMeaningGloss);
      if (g) {
        hw = g.slice(0, 80).trim();
        break;
      }
    }
  }

  return {
    lemma,
    pos,
    occ,
    hw,
    aramaic,
    head: cleanText(headHtml),
    headRefs,
    senses,
  };
}

function glossKey(gloss) {
  return String(gloss ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]+/g, " ")
    .trim();
}

/** Consonantal skeleton: strip points/cantillation so pointing variants compare equal. */
function skeleton(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-͇]/g, "")
    .replace(/[^\u05d0-\u05ea]/g, "");
}

/**
 * Load Strong's concise Hebrew definitions keyed by Strong's number
 * ("H2377" -> "a sight (mentally), i.e. a dream, revelation, or oracle").
 *
 * The openscriptures OSIS XML stores one <div type="entry" n="N"> per
 * Strong's number with the concise definition in <note type="explanation">
 * (the KJV gloss lives separately in <note type="translation">; the
 * derivation in <note type="exegesis"> — neither is the definition).
 * Tag matching is strict on this known format and the parse fails loudly
 * when the entry count is far below Strong's 8,674 Hebrew numbers, so a
 * silent upstream format change can never ship an empty `sd` layer.
 */
async function loadStrongsDefinitions() {
  const local = join(RESEARCH, "StrongHebrewG.xml");
  let xml;
  try {
    xml = await readFile(local, "utf8");
    process.stderr.write(`  using local ${local}\n`);
  } catch {
    process.stderr.write(`  fetching ${STRONGS_XML_URL}\n`);
    const res = await fetch(STRONGS_XML_URL, {
      headers: { "User-Agent": "Theos-Logos Strongs importer (public domain)" },
    });
    if (!res.ok) throw new Error(`${res.status} ${STRONGS_XML_URL}`);
    xml = await res.text();
    await mkdir(RESEARCH, { recursive: true });
    await writeFile(local, xml);
    process.stderr.write(`  cached to ${local}\n`);
  }
  const defs = {};
  const entryRe = /<div\s+type="entry"\s+n="(\d+)">([\s\S]*?)<\/div>/g;
  for (const m of xml.matchAll(entryRe)) {
    const id = `H${parseInt(m[1], 10)}`;
    const defMatch = m[2].match(/<note\s+type="explanation">([\s\S]*?)<\/note>/);
    if (!defMatch) continue;
    // Same hygiene as BDB: decode entities, strip tags, collapse whitespace.
    // Strong's <hi> marks are inline emphasis, so tags are removed WITHOUT
    // inserting spaces (the BDB stripTags inserts a space per tag, which
    // would leave "a dream , revelation"). A space-before-punctuation pass
    // catches any leftovers. Strong's wording stays verbatim otherwise
    // (its {braces} correction marks are Strong's own convention, kept).
    const text = defMatch[1]
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .trim()
      .replace(/;+$/, "")
      .trim();
    if (text) defs[id] = text;
  }
  const n = Object.keys(defs).length;
  process.stderr.write(`  Strong's definitions parsed: ${n}\n`);
  if (n < 8500) {
    throw new Error(
      `Strong's parse yielded only ${n} definitions (expected ~8674); ` +
        `upstream format may have changed — refusing to ship a thin layer.`,
    );
  }
  return defs;
}

/**
 * Expected lemma per Strong's number from the legacy STEPBible hebrew.json.
 * Used ONLY to pick the right BDB row when several claim one H-number
 * (homograph sections, variant groupings); never shipped as content.
 */
async function loadExpectedLemmas() {
  try {
    const raw = await readFile(join(DIR, "hebrew.json"), "utf8");
    const data = JSON.parse(raw);
    const out = {};
    for (const [k, v] of Object.entries(data)) {
      if (v && v.m) out[k.toUpperCase()] = skeleton(v.m);
    }
    return out;
  } catch {
    process.stderr.write("  (no legacy hebrew.json for lemma cross-check)\n");
    return {};
  }
}

function cleanedLength(p) {
  return p.head.length + p.senses.reduce((n, s) => n + s.text.length, 0);
}

/**
 * Split-time row structure helpers. The split is the exact inverse of the old
 * mergeParses(): every row keeps its own head, senses, refs, occurrence
 * count, headword gloss and POS — nothing is joined across rows.
 */

/** BDB section markers ("I.", "II.", …) on the row's head paragraphs, verbatim. */
function rowMarkers(html) {
  const markers = [];
  for (const m of String(html).matchAll(/<p>(.*?)<\/p>/gs)) {
    const t = stripTags(m[1]).replace(/\s+/g, " ").trim();
    const mm = t.match(/^(I{1,3}|IV|V)\.\s/);
    if (mm && /[֐-׿]/.test(t.slice(0, 80))) markers.push(mm[1]);
  }
  return markers;
}

/**
 * Sense-numbering resets inside one row ("1." after "3."): may hide an
 * unmarked homograph section (cf. ברא II "cut down" inside BDB1300) or may be
 * a benign stem-section reset. Flagged for hand review, never auto-split.
 */
function rowResets(html) {
  let resets = 0;
  let lastnum = 0;
  for (const m of String(html).matchAll(
    /<div class="(?:point|section|remarks)">(.*?)<\/div>/gs,
  )) {
    const t = stripTags(m[1]).replace(/\s+/g, " ").trim();
    const lab = t.match(/^([A-Za-z]+\.?|\d+\.?|[a-z]\.)\s/);
    const mn = lab && lab[1].match(/^(\d+)\./);
    if (mn) {
      const n = parseInt(mn[1], 10);
      if (n === 1 && lastnum > 1) resets++;
      lastnum = n;
    }
  }
  return resets;
}

/** Pure cross-reference stubs ("see below X", "q.v."): no article, droppable. */
function isSeeStub(headText) {
  const t = String(headText || "");
  return (
    /\bsee\s+(below|above|under)\b/i.test(t) ||
    /\bq\.\s?v\./i.test(t) ||
    /\bsee\s+[IV]+\.?\s*[\u0590-\u05ea]/i.test(t) ||
    /\bsee\s+[\u0590-\u05ea]/i.test(t)
  );
}

function bdbNum(id) {
  const n = parseInt(String(id).replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

async function main() {
  process.stderr.write("Importing unabridged BDB…\n");
  const csvText = await loadCsv();
  const rows = parseTsv(csvText);
  process.stderr.write(`  CSV rows: ${rows.length}\n`);
  const expected = await loadExpectedLemmas();

  // Strong's number → candidate BDB rows (split H1274_H1279-style multis).
  const claims = new Map();
  for (const row of rows) {
    const parts = String(row.strong).split(/[_\s,;]+/);
    for (const part of parts) {
      const id = normalizeStrongs(part);
      if (!id) continue;
      if (!claims.has(id)) claims.set(id, []);
      claims.get(id).push(row);
    }
  }
  process.stderr.write(`  H-numbers claimed: ${claims.size}\n`);

  // Dedup: pick the BDB row that is really about this Strong's number.
  // 1. lemma-match: the row's headword matches the expected lemma (this beats
  //    "mentioned-in" rows like the יהוה entry listing H430 among related
  //    numbers, and beats cross-ref stubs).
  // 2. exact single-number mapping, substantive length.
  // 3. multi-number row where this H-number comes first (variant groupings).
  // 4. longest cleaned entry (last resort; logged for review).
  const stats = { lemma: 0, exact: 0, first: 0, fallback: 0 };
  let merged = 0; // H-numbers whose I./II./III. homograph rows were merged
  const fallbacks = [];
  const winners = new Map();
  for (const [id, list] of claims) {
    const parsed = list.map((row, i) => ({ row, i, p: parseEntry(row.html) }));
    const want = expected[id] || "";
    const lemmaHit = parsed.filter(
      ({ p }) => want && p.lemma && skeleton(p.lemma) === want,
    );
    let win = null;
    let rule = "";
    if (lemmaHit.length) {
      // Prefer the Hebrew article over the Biblical Aramaic appendix
      // companion, then the row dedicated to this exact number over a shared
      // multi-number row, then the longest entry. (H3 אֵב 'freshness' wants
      // BDB3, not the Aramaic-section row BDB9264; H8 אֹבֵד 'destruction'
      // wants BDB7, not the אָבַד verb article BDB6.)
      const rankLemma = (x) => [
        x.p.aramaic ? 1 : 0,
        x.row.strong.trim().toUpperCase() === id ? 0 : 1,
        -cleanedLength(x.p),
      ];
      win = lemmaHit
        .map((x) => ({ x, r: rankLemma(x) }))
        .sort(
          (a, b) => a.r[0] - b.r[0] || a.r[1] - b.r[1] || a.r[2] - b.r[2],
        )[0].x;
      rule = "lemma";
    } else {
      const exact = parsed.filter(
        ({ row, p }) =>
          row.strong.trim().toUpperCase() === id && cleanedLength(p) >= 200,
      );
      if (exact.length) {
        win = exact.reduce((a, b) =>
          cleanedLength(b.p) > cleanedLength(a.p) ? b : a,
        );
        rule = "exact";
      } else {
        const first = parsed.filter(
          ({ row }) =>
            row.strong.trim().split(/[_\s,;]+/)[0].toUpperCase() === id,
        );
        if (first.length) {
          win = first.reduce((a, b) =>
            cleanedLength(b.p) > cleanedLength(a.p) ? b : a,
          );
          rule = "first";
        } else {
          win = parsed.reduce((a, b) =>
            cleanedLength(b.p) > cleanedLength(a.p) ? b : a,
          );
          rule = "fallback";
          fallbacks.push(
            `${id}: ${win.row.id} (sn=${win.row.strong}, lemma=${win.p.lemma || "?"})`,
          );
        }
      }
    }
    stats[rule] += 1;
    // Homograph merge: keep every claiming row whose consonantal headword and
    // language match the winner's — BDB's I./II./III. sections are one entry
    // (e.g. H4853 מַשָּׂא keeps "load, burden" AND "utterance, oracle").
    // Different-headword rows ("mentioned-in" rows, cross-ref stubs, the
    // Biblical Aramaic appendix cognate) stay dropped by the rules above.
    const winSkel = skeleton(win.p.lemma);
    let group = parsed.filter(
      ({ p }) =>
        p.lemma && p.aramaic === win.p.aramaic && skeleton(p.lemma) === winSkel,
    );
    if (!group.length) group = [{ row: win.row, p: win.p }];
    // The winning row leads: it is the row judged really about this
    // Strong's number, so its headword opens the card. Remaining merged
    // sections follow in BDB row order (BDB's own I./II./III. sequence).
    group.sort((a, b) => {
      if (a.row.id === win.row.id) return -1;
      if (b.row.id === win.row.id) return 1;
      return bdbNum(a.row.id) - bdbNum(b.row.id);
    });
    if (group.length > 1) merged++;
    // Homograph SPLIT (not merge): keep every row's parse independent. The
    // entry-building phase below emits the winner row as the primary entry
    // (canonical H#### key) and each further row as its own split entry
    // (H####b/c/…), per the row-kind rules in the header.
    winners.set(id, {
      rows: group.map((g) => g.row),
      parses: group.map((g) => g.p),
    });
  }
  const multiClaim = [...claims.values()].filter((l) => l.length > 1).length;
  process.stderr.write(
    `  ${multiClaim} H-numbers claimed by multiple rows ` +
      `(lemma ${stats.lemma}, exact ${stats.exact}, first ${stats.first}, fallback ${stats.fallback}; ${merged} homograph merges)\n`,
  );
  if (fallbacks.length) {
    process.stderr.write(
      `  fallback resolutions to review (${fallbacks.length}):\n` +
        fallbacks
          .slice(0, 25)
          .map((f) => `    ${f}\n`)
          .join(""),
    );
  }

  // Compact entries, in canonical Strong's order — with the homograph split.
  // BDB row id -> canonical H-number whose WINNER row it is (for the
  // shared-row rule: a non-winner row that is another entry's winner is
  // replaced by a seeAlso pointer, never duplicated).
  const winnerOfRow = new Map();
  for (const [wid, w] of winners) winnerOfRow.set(w.rows[0].id, wid);

  /** Per-row sense blocks with the same caps the old importer used. */
  function buildSenses(p) {
    let budget = ENTRY_BUDGET;
    const senses = [];
    const headText = capText(p.head, Math.min(HEAD_CAP, budget));
    budget -= headText.length;
    if (headText) {
      senses.push({
        t: headText,
        g: [],
        // The head keeps every verse BDB cites (uncapped): it is the entry's
        // anchor block, and a cap here silently drops verse-anchored picks
        // (e.g. H4853 "utterance, oracle" cites Hab 1:1 deep in its head).
        rv: p.headRefs.map(refKey),
      });
    }
    for (const s of p.senses.slice(0, MAX_SENSES)) {
      if (budget <= 0) break;
      const t = capText(s.text, Math.min(SENSE_CAP, budget));
      budget -= t.length;
      if (!t) break;
      senses.push({
        t,
        g: s.glosses,
        rv: s.refs.slice(0, REF_CAP).map(refKey),
      });
    }
    return senses;
  }

  /** needsReview flag for one source row (never auto-split within a row). */
  function reviewFlag(html) {
    const markers = rowMarkers(html);
    const resets = rowResets(html);
    const reasons = [];
    if (resets > 0)
      reasons.push(
        "sense-numbering resets may hide an unmarked homograph section",
      );
    if (markers.length >= 2)
      reasons.push("multiple head paragraphs (I./II. sections) in one source row");
    return {
      sec: markers[0],
      needsReview: reasons.length > 0,
      needsReviewReason: reasons.join("; "),
    };
  }

  /**
   * Hand-review queue (R8): the 62 merged groups whose rows have
   * sense-numbering resets or multiple head paragraphs (UNMARKED-RESET +
   * INNER-SECTIONS from the homograph analysis). The flag is attached to the
   * specific source ROW, so it follows the row to its canonical entry when a
   * flagged row was relocated via seeAlso (e.g. BDB6 → H6).
   */
  const HAND_REVIEW_IDS = new Set([
    "H8", "H1167", "H1197", "H1254", "H1984", "H2151", "H2342", "H2470",
    "H2490", "H2502", "H2505", "H2603", "H2617", "H2763", "H2764", "H2790",
    "H3068", "H3069", "H3373", "H3581", "H3588", "H3722", "H4116", "H4229",
    "H4482", "H4541", "H4794", "H4835", "H4888", "H4994", "H5035", "H5090",
    "H5257", "H5493", "H5494", "H5608", "H5646", "H5674", "H5800", "H6031",
    "H6213", "H6327", "H6331", "H6544", "H6565", "H6601", "H6692", "H6731",
    "H6732", "H6957", "H7136", "H7203", "H7235", "H7489", "H7503", "H7605",
    "H7673", "H7845", "H7931", "H7933", "H7999", "H9003",
  ]);
  const handReviewRows = new Set();
  for (const hid of HAND_REVIEW_IDS) {
    const w = winners.get(hid);
    if (!w) continue;
    for (const r of w.rows) {
      if (reviewFlag(r.html).needsReview) handReviewRows.add(r.id);
    }
  }

  const ids = [...winners.keys()].sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  const by = {};
  const splitStats = {
    mergedGroups: 0,
    splitEntries: 0,
    droppedStubs: 0,
    seeAlso: 0,
    stubEntries: 0,
    needsReview: 0,
  };
  const droppedLog = [];
  let truncated = 0;
  let aramaicCount = 0;
  for (const id of ids) {
    const { rows: srcRows, parses } = winners.get(id);
    const emit = (key, rowId, p, extra) => {
      const fullLen =
        p.head.length + p.senses.reduce((n, s) => n + s.text.length, 0);
      if (fullLen > ENTRY_BUDGET) truncated += 1;
      if (p.aramaic) aramaicCount += 1;
      by[key] = {
        s: id,
        /** This entry's own source CSV row (traceability for audits). */
        row: rowId,
        m: p.lemma,
        ...(p.pos ? { pos: [p.pos] } : {}),
        ...(p.occ ? { occ: p.occ } : {}),
        ...(p.hw ? { hw: p.hw } : {}),
        ...(p.aramaic ? { lang: "aramaic" } : {}),
        ...extra,
        ss: buildSenses(p),
        src: "bdb",
      };
    };

    if (srcRows.length === 1) {
      // Unmerged: same shape as the old importer, plus the needsReview flag
      // when this row is one of the 62 hand-review rows (e.g. BDB6 carries
      // H8's old UNMARKED-RESET flag at its canonical home H6).
      const wflag = reviewFlag(srcRows[0].html);
      const flagged = handReviewRows.has(srcRows[0].id);
      if (flagged) splitStats.needsReview += 1;
      emit(id, srcRows[0].id, parses[0], {
        ...(flagged
          ? { needsReview: true, needsReviewReason: wflag.needsReviewReason }
          : {}),
      });
      continue;
    }
    splitStats.mergedGroups += 1;
    // Primary: the winner row keeps the canonical H#### key.
    const wflag = reviewFlag(srcRows[0].html);
    const wflagged = handReviewRows.has(srcRows[0].id);
    const seeAlso = [];
    const droppedStubs = [];
    if (wflagged) splitStats.needsReview += 1;
    // Non-winner rows, in BDB row order: split, point, or drop.
    const splitRows = [];
    for (let i = 1; i < srcRows.length; i++) {
      const rrow = srcRows[i];
      const rp = parses[i];
      const owner = winnerOfRow.get(rrow.id);
      if (owner && owner !== id) {
        if (!seeAlso.includes(owner)) seeAlso.push(owner);
        splitStats.seeAlso += 1;
        continue;
      }
      const flag = reviewFlag(rrow.html);
      const flagged = handReviewRows.has(rrow.id);
      if (rp.senses.length > 0 || rp.headRefs.length > 0) {
        splitRows.push({ rrow, rp, flag, flagged, stub: false });
      } else if (isSeeStub(rp.head)) {
        droppedStubs.push(rrow.id);
        splitStats.droppedStubs += 1;
        droppedLog.push(`${id}: ${rrow.id} dropped ("${(rp.head || "").slice(0, 70)}")`);
      } else {
        splitRows.push({ rrow, rp, flag, flagged, stub: true });
        splitStats.stubEntries += 1;
      }
      if (flagged) splitStats.needsReview += 1;
    }
    emit(id, srcRows[0].id, parses[0], {
      ...(wflag.sec ? { sec: wflag.sec } : {}),
      splitIndex: 0,
      ...(wflagged
        ? { needsReview: true, needsReviewReason: wflag.needsReviewReason }
        : {}),
      ...(seeAlso.length ? { seeAlso } : {}),
      ...(droppedStubs.length ? { droppedStubs } : {}),
    });
    splitRows.forEach(({ rrow, rp, flag, flagged, stub }, i) => {
      const n = i + 1;
      if (n > 26) throw new Error(`${id}: more than 26 splits`);
      const key = `${id}${String.fromCharCode(0x61 + n)}`;
      splitStats.splitEntries += 1;
      emit(key, rrow.id, rp, {
        ...(flag.sec ? { sec: flag.sec } : {}),
        splitFrom: id,
        splitIndex: n,
        ...(stub ? { stub: true } : {}),
        ...(flagged
          ? { needsReview: true, needsReviewReason: flag.needsReviewReason }
          : {}),
      });
    });
  }
  process.stderr.write(
    `  shipped: ${Object.keys(by).length} entries for ${ids.length} Strong's numbers ` +
      `(${splitStats.mergedGroups} merged groups → ${splitStats.splitEntries} splits, ` +
      `${splitStats.stubEntries} stub entries, ${splitStats.droppedStubs} stubs dropped, ` +
      `${splitStats.seeAlso} seeAlso pointers, ${splitStats.needsReview} needsReview flags; ` +
      `${aramaicCount} Aramaic; ${truncated} trimmed by budget)\n`,
  );
  if (droppedLog.length) {
    process.stderr.write(
      `  dropped stubs (${droppedLog.length}):\n` +
        droppedLog.slice(0, 30).map((l) => `    ${l}\n`).join("") +
        (droppedLog.length > 30 ? `    … and ${droppedLog.length - 30} more\n` : ""),
    );
  }

  // Merge Strong's concise definitions (the card's Meaning hero). Verbatim
  // Strong's text under its own attribution; entries with no Strong's
  // definition keep the BDB-gloss hero as fallback. Every split carries the
  // canonical number's definition verbatim (it is Strong's definition OF THE
  // NUMBER); on split entries the card lets a verse-matched BDB sense
  // outrank it.
  const strongs = await loadStrongsDefinitions();
  // All entry keys in canonical order: primaries first, then their splits.
  const allKeys = Object.keys(by).sort((a, b) => {
    const na = parseInt(a.slice(1), 10);
    const nb = parseInt(b.slice(1), 10);
    if (na !== nb) return na - nb;
    const sa = a.slice(1).replace(/^\d+/, "");
    const sb = b.slice(1).replace(/^\d+/, "");
    return sa < sb ? -1 : sa > sb ? 1 : 0;
  });
  let strongsHits = 0;
  const strongsMissing = [];
  for (const key of allKeys) {
    const def = strongs[by[key].s];
    if (def) {
      by[key].sd = def;
      strongsHits += 1;
    } else {
      strongsMissing.push(key);
    }
  }
  process.stderr.write(
    `  Strong's definitions merged: ${strongsHits}/${allKeys.length}` +
      (strongsMissing.length
        ? ` (missing: ${strongsMissing.slice(0, 12).join(", ")}${strongsMissing.length > 12 ? "…" : ""})`
        : "") +
      "\n",
  );

  // English gloss → Strong's index from BDB's own highlighted glosses.
  // Rebuilt per split entry from its own glosses only (R5): "cut down" →
  // H1254b, "herb" → H219b. Candidates rank: Hebrew before Biblical Aramaic
  // (a bare English lookup like "see" should surface Hebrew H2372 חָזָה, not
  // Aramaic H2370 חֲזָא); then by headword-phrase position, so the entry
  // whose PRIMARY gloss is the word wins ("hear" → H8085 שָׁמַע 'hear', not
  // H238 אָזַן whose hw is 'give ear, listen, hear, almost wholly poet');
  // Strong's number breaks remaining ties (primary before its splits).
  // Sense-gloss-only matches rank after headword matches.
  const byGloss = Object.create(null);
  const seenGloss = new Map(); // id -> Set of keys already indexed
  const glossMeta = new Map(); // `${key}␟${id}` -> { aram, pos }
  const addGloss = (id, ph, isHw) => {
    let seen = seenGloss.get(id);
    if (!seen) {
      seen = new Set();
      seenGloss.set(id, seen);
    }
    const aram = by[id].lang === "aramaic" ? 1 : 0;
    String(ph)
      .split(/[;,·]/)
      .forEach((part, pi) => {
        const key = glossKey(part);
        if (key.length < 2 || key.length > 24 || seen.has(key)) return;
        seen.add(key);
        glossMeta.set(`${key}␟${id}`, { aram, pos: isHw ? pi : 99 });
        const list = byGloss[key] ?? [];
        if (!list.includes(id)) list.push(id);
        byGloss[key] = list;
      });
  };
  for (const id of allKeys) {
    if (by[id].hw) addGloss(id, by[id].hw, true);
  }
  for (const id of allKeys) {
    for (const s of by[id].ss) for (const g of s.g) addGloss(id, g, false);
  }
  for (const [key, list] of Object.entries(byGloss)) {
    list.sort((a, b) => {
      const ma = glossMeta.get(`${key}␟${a}`);
      const mb = glossMeta.get(`${key}␟${b}`);
      return (
        ma.aram - mb.aram ||
        ma.pos - mb.pos ||
        parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10)
      );
    });
    byGloss[key] = list.slice(0, 6);
  }
  process.stderr.write(`  gloss index keys: ${Object.keys(byGloss).length}\n`);

  await mkdir(DIR, { recursive: true });
  const out = {
    attribution: ATTRIBUTION,
    license: "Public domain",
    source: SOURCE_URL,
    strongsAttribution: STRONGS_ATTRIBUTION,
    strongsLicense: "Public domain",
    strongsSource: STRONGS_SOURCE_URL,
    retrieved: new Date().toISOString().slice(0, 10),
    provenance:
      "unabridged-BDB-Hebrew-lexicon.csv (Eliran Wong formatting of BDB 1906); " +
      "Strong's mapping from the CSV's 2nd column; duplicate H-claims resolved " +
      "by headword-lemma match against the legacy Strong's lemma, then exact " +
      "single-number mapping, then first-listed variant, then longest entry; " +
      "homograph sections SPLIT per source row (winner row keeps the H#### key, " +
      "further rows become H####b/c/… in BDB row order; see-stubs dropped with " +
      "droppedStubs trace, shared rows replaced by seeAlso pointers, " +
      "within-row sections never auto-split and flagged needsReview); " +
      "markup stripped, wording verbatim; " +
      `caps head/${HEAD_CAP} sense/${SENSE_CAP} senses/${MAX_SENSES} refs/${REF_CAP} budget/${ENTRY_BUDGET}; ` +
      "concise per-entry definitions (sd) from openscriptures/strongs " +
      "hebrew/StrongHebrewG.xml (Strong's Hebrew Dictionary, 1890, public domain).",
    by,
    byGloss,
  };
  const path = join(DIR, "hebrew-bdb.json");
  await writeFile(path, JSON.stringify(out));
  const bytes = Buffer.byteLength(JSON.stringify(out));
  process.stderr.write(
    `Wrote ${path} (${Object.keys(by).length} entries / ${ids.length} strongs, ${Object.keys(byGloss).length} gloss keys, ${Math.round(bytes / 1024)} KB)\n`,
  );
  const h7225 = by.H7225;
  process.stderr.write(`  sample H7225 hw: ${JSON.stringify(h7225?.hw)} senses: ${h7225?.ss?.length}\n`);
  const h1254 = by.H1254;
  process.stderr.write(`  sample H1254 hw: ${JSON.stringify(h1254?.hw)} lemma: ${h1254?.m}\n`);
  const h1254b = by.H1254b;
  process.stderr.write(`  sample H1254b hw: ${JSON.stringify(h1254b?.hw)} sec: ${h1254b?.sec} senses: ${h1254b?.ss?.length}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
