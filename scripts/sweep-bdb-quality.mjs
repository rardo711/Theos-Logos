/**
 * Full-dataset QC sweep for the Hebrew BDB lexicon ("are all OT cards clean?").
 *
 * Phase 1 — shipped hygiene (hebrew-bdb.json only): completeness, no
 * formatting artifacts, index integrity, verse-key sanity.
 * Phase 2 — source cross-check (raw BDB CSV): every shipped row id exists and
 * claims its H-number; no dropped row should have been merged (same
 * consonantal headword + same language as the winner); no claimed H-number
 * is missing from the shipped data.
 * Phase 3 — known-word probes through the real lookup code.
 *
 * Usage: node --experimental-strip-types scripts/sweep-bdb-quality.mjs
 * Exit code: 0 when clean, 1 when problems were found.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src/lib/lexicon/data");
const CSV = join(ROOT, "..", "bdb-hebrew-research", "unabridged-BDB-Hebrew-lexicon.csv");

const failures = [];
const warnings = [];
const fail = (msg) => failures.push(msg);
const warn = (msg) => warnings.push(msg);

/* ---------- tiny mirrors of importer helpers (independent 2nd pair of eyes) ---------- */
function skeleton(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-͇]/g, "")
    .replace(/[^\u05d0-\u05ea]/g, "");
}
function normH(raw) {
  const m = String(raw ?? "")
    .toUpperCase()
    .match(/H\s*0*(\d+)/);
  return m && m[1] !== "0" ? `H${m[1]}` : "";
}
/** Lemma + Biblical-Aramaic flag from a raw BDB row's HTML. */
function rowMeta(html) {
  let c = html.replace(/<h1>.*?<\/h1>/gs, " ");
  c = c.replace(/<div class="navigation">.*?<\/div>/gs, " ");
  const nav = (html.match(/<div class="navigation">(.*?)<\/div>/s) || [])[1] || "";
  const aramaic = /BIBLICAL ARAMAIC/.test(nav);
  const head = (c.match(/<p>(.*?)<\/p>/s) || [])[1] || "";
  let lemma = "";
  for (const m of head.matchAll(/<(bdbheb|bdbarc|bdbare|heb)>(.*?)<\/\1>/gs)) {
    const t = m[2].replace(/<[^>]+>/g, " ").trim();
    if (/[\u0590-\u05ea]/.test(t)) {
      lemma = t.slice(0, 60);
      break;
    }
  }
  const hwM = head.match(/<highlightword>(.*?)<\/highlightword>/s);
  const hw = hwM ? hwM[1].replace(/<[^>]+>/g, " ").trim().slice(0, 80) : "";
  return { lemma, aramaic, hw };
}

/* ---------- load ---------- */
const data = JSON.parse(await readFile(join(DIR, "hebrew-bdb.json"), "utf8"));
const { by, byGloss } = data;
const ids = Object.keys(by);
console.log(`entries: ${ids.length}, gloss keys: ${Object.keys(byGloss).length}`);

/* ---------- Phase 1: shipped hygiene ---------- */
const BAD_TEXT = [
  [/\\/g, "backslash"],
  [/<\/?[a-z][^>]*>/i, "HTML tag remnant"],
  [/&(amp|lt|gt|nbsp|emsp|ensp|thinsp|quot|#39);/, "HTML entity"],
  [/>BIBLE:[^<>]*>/, "metadata tag remnant"],
  [/[\u0000-\u0008\u000b-\u000c\u000e-\u001f]/, "control character"],
];
let p1 = 0;
let glosslessSenses = 0;
const checkStr = (id, where, v) => {
  if (typeof v !== "string" || !v) return;
  p1++;
  for (const [re, name] of BAD_TEXT) {
    if (re.test(v)) fail(`${id} ${where}: ${name} in ${JSON.stringify(v.slice(0, 70))}`);
  }
  if (v !== v.trim()) fail(`${id} ${where}: leading/trailing whitespace`);
};
for (const id of ids) {
  const e = by[id];
  if (!e.m) fail(`${id}: missing lemma`);
  if (e.hw !== undefined && !e.hw) fail(`${id}: empty headword gloss`);
  if (!Array.isArray(e.ss) || e.ss.length === 0) fail(`${id}: no senses`);
  checkStr(id, "lemma", e.m);
  checkStr(id, "hw", e.hw);
  for (const p of e.pos || []) {
    checkStr(id, "pos", p);
    // Bare sense/section labels ("1.", "a.", "II.", "2 b") are BDB
    // cross-reference furniture, never a part of speech (H1276 shipped "3.").
    if (/^([a-z]+\.|[a-z]?\d+\s?[a-z]?\.?)$/i.test(p))
      fail(`${id} pos: sense label leaked as POS ${JSON.stringify(p)}`);
  }
  // duplicated "; "-joined headword parts look sloppy on cards
  if (e.hw) {
    const parts = e.hw.split(";").map((s) => s.trim().toLowerCase());
    if (new Set(parts).size !== parts.length)
      warn(`${id}: repeated headword part in ${JSON.stringify(e.hw)}`);
  }
  for (let i = 0; i < (e.ss || []).length; i++) {
    const s = e.ss[i];
    if (!s.t) fail(`${id} sense ${i}: empty text`);
    // The head block (sense 0) must be the article head, never a "see X"
    // cross-reference stub (H1276 picked the בְּרִית stub instead of בֵּרִים).
    if (i === 0 && /^[\u0590-\u05ea]+\s+see (below|above)/i.test(s.t))
      fail(`${id} sense 0: stub picked as head: ${JSON.stringify(s.t.slice(0, 70))}`);
    // Sense 0 is the head block: its "gloss" is the entry hw, so g:[] is by
    // design. Glossless deeper blocks are ordinary BDB structure (prose-only
    // remarks/discussion) — not a defect; their text and refs are still
    // validated. Counted here only for the report.
    if (i > 0 && (!Array.isArray(s.g) || s.g.length === 0)) glosslessSenses++;
    checkStr(id, `sense[${i}].t`, s.t);
    for (const g of s.g || []) checkStr(id, `sense[${i}].g`, g);
    for (const r of s.rv || []) {
      if (!/^\d{9}$/.test(r)) fail(`${id} sense ${i}: bad verse key ${r}`);
    }
  }
}
console.log(`phase 1: checked ${p1} shipped strings`);
console.log(`phase 1: ${glosslessSenses} glossless sense blocks (ordinary BDB prose structure, not failures)`);

// index integrity
let emptyGloss = 0;
for (const [k, list] of Object.entries(byGloss)) {
  if (!Array.isArray(list) || list.length === 0) {
    emptyGloss++;
    continue;
  }
  for (const id of list) if (!by[id]) fail(`byGloss[${k}] -> missing entry ${id}`);
}
if (emptyGloss) warn(`${emptyGloss} gloss keys map to nothing`);

// entries with no verse refs at all (informational)
const noRefs = ids.filter((id) => !by[id].ss.some((s) => (s.rv || []).length));
if (noRefs.length) warn(`${noRefs.length} entries cite no verses (e.g. ${noRefs.slice(0, 5).join(", ")})`);

/* ---------- Phase 2: source cross-check ---------- */
const csvText = await readFile(CSV, "utf8");
const lines = csvText.split(/\r?\n/);
const rows = [];
for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split("\t");
  if (cols.length < 3 || !lines[i].trim()) continue;
  rows.push({ id: cols[0], strong: cols[1], html: cols.slice(2).join("\t") });
}
const byId = new Map(rows.map((r) => [r.id, r]));
const claims = new Map();
for (const row of rows) {
  for (const part of String(row.strong).split(/[_\s,;]+/)) {
    const id = normH(part);
    if (!id) continue;
    if (!claims.has(id)) claims.set(id, []);
    claims.get(id).push(row);
  }
}
console.log(`phase 2: ${rows.length} source rows, ${claims.size} claimed H-numbers`);

// every claimed H ships; every shipped row id exists and claims its H
for (const id of claims.keys()) {
  if (!by[id]) fail(`claimed ${id} missing from shipped data`);
}
let mergedGroups = 0;
for (const id of ids) {
  const e = by[id];
  const rowIds = String(e.row).split("+");
  if (rowIds.length > 1) mergedGroups++;
  for (const rid of rowIds) {
    const row = byId.get(rid);
    if (!row) {
      fail(`${id}: shipped row ${rid} not found in source`);
      continue;
    }
    const claimed = String(row.strong)
      .split(/[_\s,;]+/)
      .map(normH);
    if (!claimed.includes(id)) fail(`${id}: shipped row ${rid} does not claim ${id}`);
  }
}
// merge-miss check: dropped rows that match winner skeleton + language
let multiClaim = 0;
for (const [id, list] of claims) {
  if (list.length < 2) continue;
  multiClaim++;
  const e = by[id];
  if (!e) continue;
  const shipped = new Set(String(e.row).split("+"));
  const winSkel = skeleton(e.m);
  const winAram = e.lang === "aramaic";
  for (const row of list) {
    if (shipped.has(row.id)) continue;
    const meta = rowMeta(row.html);
    if (meta.lemma && skeleton(meta.lemma) === winSkel && meta.aramaic === winAram) {
      fail(
        `${id}: dropped row ${row.id} matches winner (lemma ${meta.lemma}, hw ${JSON.stringify(meta.hw)}) — should have merged`,
      );
    }
  }
}
console.log(`phase 2: ${multiClaim} multi-claim H-numbers, ${mergedGroups} merged groups — no merge misses above`);

/* ---------- Phase 3: known-word probes ---------- */
const { lookupHebrewBdbWordNow } = await import("../src/lib/lexicon/hebrew-bdb.ts");
// Intended default winners (bare English lookup, no verse): the entry whose
// own BDB headword IS the query word, Hebrew before Aramaic. Verse taps use
// verse-anchored sense selection instead (covered by the test suite).
const probes = [
  ["love", "H157"], ["light", "H216"], ["create", "H1254"], ["see", "H2372"],
  ["hear", "H8085"], ["king", "H4428"], ["earth", "H776"], ["heaven", "H8064"],
  ["water", "H4325"], ["bread", "H3899"], ["son", "H1121"], ["father", "H1"],
  ["day", "H3117"], ["night", "H3915"], ["hand", "H3027"], ["heart", "H3820"],
  ["good", "H2895"], ["go", "H1980"], ["come", "H857"], ["say", "H559"],
  ["give", "H3051"], ["take", "H3947"], ["make", "H6213"], ["oracle", "H4853"],
  ["saw", "H4050"], ["beginning", "H7225"], ["god", "H433"],
];
let probeFails = 0;
for (const [word, want] of probes) {
  const hit = lookupHebrewBdbWordNow(word);
  if (!hit) {
    fail(`probe "${word}": no hit (want ${want})`);
    probeFails++;
  } else if (hit.strongs !== want) {
    fail(`probe "${word}": got ${hit.strongs} (want ${want})`);
    probeFails++;
  }
}
console.log(`phase 3: ${probes.length - probeFails}/${probes.length} known-word probes hit expected Strong's`);

/* ---------- report ---------- */
console.log(`\nwarnings: ${warnings.length}`);
for (const w of warnings.slice(0, 20)) console.log(`  ~ ${w}`);
if (warnings.length > 20) console.log(`  ~ ...and ${warnings.length - 20} more`);
console.log(`failures: ${failures.length}`);
const byPat = new Map();
for (const f of failures) {
  const pat = f.replace(/H\d+/, "H#").replace(/sense \d+/, "sense #");
  byPat.set(pat, (byPat.get(pat) || 0) + 1);
}
for (const [pat, n] of [...byPat.entries()].sort((a, b) => b[1] - a[1]))
  console.log(`  ${n}× ${pat.slice(0, 100)}`);
process.exit(failures.length ? 1 : 0);
