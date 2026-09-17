#!/usr/bin/env node
/**
 * Build compact Hebrew lexicon from unabridged BDB (Brown-Driver-Briggs, 1906).
 *
 * Source: https://github.com/primekoboo-bibleresources/unabridged-bdb-hebrew-lexicon
 * (CSV with Strong's number mapping; "Public domain document" per its README;
 * BDB itself is 1906, public domain.)
 *
 * Run locally / on the box — DO NOT download at Vercel build.
 * Outputs: src/lib/lexicon/data/hebrew-bdb.json
 *
 * Fidelity rules (Gerardo's standing condition: faithful to the original lexicon):
 * 1. PRIMARY — BDB HTML entries keyed by Strong's (H####). One H-number is often
 *    claimed by several BDB rows: homograph sections (I./II./III. under one
 *    headword), "see X" cross-ref stubs, Biblical Aramaic appendix rows, and
 *    "mentioned-in" rows. Homograph sections — rows whose consonantal headword
 *    and language (Hebrew/Aramaic) match the winning row's — are MERGED in BDB
 *    row order so no BDB meaning is dropped (e.g. H4853 מַשָּׂא keeps both
 *    "load, burden" and "utterance, oracle"). Rows with a different headword
 *    keep the longest-cleaned-text rule — stubs lose, the full entry wins.
 *    Wording is never paraphrased or regenerated.
 * 2. Markup is stripped to plain text; the wording stays verbatim. Very long
 *    entries are truncated at a per-entry budget (earliest senses kept whole) —
 *    truncation only, never rewriting.
 * 3. Verse refs come from the structured <ref b cBegin vBegin cEnd vEnd>
 *    attributes (SBL book numbering: 1=Gen … 39=Mal) so the card can pick the
 *    sense cited for the verse being read, mirroring the UBS rv scheme.
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
 * Merge BDB homograph sections (I./II./III.) that share one Strong's number.
 * Every word stays verbatim BDB; only the container is joined, in BDB row
 * order (lowest BDB id first — the primary section keeps headword priority).
 * Headword glosses join with "; ", POS joins with "; ", senses concatenate,
 * occurrence counts sum, head refs union.
 */
function mergeParses(ps) {
  const first = ps[0];
  const hwParts = [];
  const posParts = [];
  const heads = [];
  const senses = [];
  let occ = 0;
  let aramaic = false;
  for (const p of ps) {
    for (const h of String(p.hw || "").split(";")) {
      const t = h.trim();
      if (t && !hwParts.includes(t)) hwParts.push(t);
    }
    if (p.pos && !posParts.includes(p.pos)) posParts.push(p.pos);
    occ += p.occ || 0;
    if (p.aramaic) aramaic = true;
    if (p.head) heads.push(p.head);
    for (const s of p.senses) senses.push(s);
  }
  // Head refs: round-robin across the merged sections so each homograph
  // section is represented early (e.g. H4853's "utterance, oracle" head cites
  // Hab 1:1). Single-section entries keep their original ref order.
  const refLists = ps.map((p) => p.headRefs || []);
  const headRefs = [];
  const seenRef = new Set();
  for (let i = 0; ; i++) {
    let any = false;
    for (const list of refLists) {
      const r = list[i];
      if (!r) continue;
      any = true;
      const k = `${r.b}.${r.c1}.${r.v1}-${r.c2}.${r.v2}`;
      if (!seenRef.has(k)) {
        seenRef.add(k);
        headRefs.push(r);
      }
    }
    if (!any) break;
  }
  return {
    lemma: first.lemma,
    pos: posParts.join("; "),
    occ,
    hw: hwParts.join("; "),
    aramaic,
    head: heads.join("\n\n"),
    headRefs,
    senses,
  };
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
    winners.set(id, {
      rows: group.map((g) => g.row),
      p: mergeParses(group.map((g) => g.p)),
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

  // Compact entries, in canonical Strong's order.
  const ids = [...winners.keys()].sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  const by = {};
  let truncated = 0;
  let aramaicCount = 0;
  for (const id of ids) {
    const { rows: srcRows, p } = winners.get(id);
    const fullLen =
      p.head.length + p.senses.reduce((n, s) => n + s.text.length, 0);
    if (fullLen > ENTRY_BUDGET) truncated += 1;
    if (p.aramaic) aramaicCount += 1;

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
    by[id] = {
      s: id,
      /** Winning source CSV row(s); "+"-joined when homographs were merged. */
      row: srcRows.map((r) => r.id).join("+"),
      m: p.lemma,
      ...(p.pos ? { pos: [p.pos] } : {}),
      ...(p.occ ? { occ: p.occ } : {}),
      ...(p.hw ? { hw: p.hw } : {}),
      ...(p.aramaic ? { lang: "aramaic" } : {}),
      ss: senses,
      src: "bdb",
    };
  }
  process.stderr.write(
    `  shipped: ${ids.length} Strong's entries (${aramaicCount} Aramaic), ${truncated} trimmed by budget\n`,
  );

  // English gloss → Strong's index from BDB's own highlighted glosses.
  // Candidates rank: Hebrew before Biblical Aramaic (a bare English lookup
  // like "see" should surface Hebrew H2372 חָזָה, not Aramaic H2370 חֲזָא);
  // then by headword-phrase position, so the entry whose PRIMARY gloss is
  // the word wins ("hear" → H8085 שָׁמַע 'hear', not H238 אָזַן whose hw is
  // 'give ear, listen, hear, almost wholly poet'); Strong's number breaks
  // remaining ties. Sense-gloss-only matches rank after headword matches.
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
  for (const id of ids) {
    if (by[id].hw) addGloss(id, by[id].hw, true);
  }
  for (const id of ids) {
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
    retrieved: new Date().toISOString().slice(0, 10),
    provenance:
      "unabridged-BDB-Hebrew-lexicon.csv (Eliran Wong formatting of BDB 1906); " +
      "Strong's mapping from the CSV's 2nd column; duplicate H-claims resolved " +
      "by headword-lemma match against the legacy Strong's lemma, then exact " +
      "single-number mapping, then first-listed variant, then longest entry; " +
      "markup stripped, wording verbatim; " +
      `caps head/${HEAD_CAP} sense/${SENSE_CAP} senses/${MAX_SENSES} refs/${REF_CAP} budget/${ENTRY_BUDGET}.`,
    by,
    byGloss,
  };
  const path = join(DIR, "hebrew-bdb.json");
  await writeFile(path, JSON.stringify(out));
  const bytes = Buffer.byteLength(JSON.stringify(out));
  process.stderr.write(
    `Wrote ${path} (${ids.length} strongs, ${Object.keys(byGloss).length} gloss keys, ${Math.round(bytes / 1024)} KB)\n`,
  );
  const h7225 = by.H7225;
  process.stderr.write(`  sample H7225 hw: ${JSON.stringify(h7225?.hw)} senses: ${h7225?.ss?.length}\n`);
  const h1254 = by.H1254;
  process.stderr.write(`  sample H1254 hw: ${JSON.stringify(h1254?.hw)} lemma: ${h1254?.m}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
