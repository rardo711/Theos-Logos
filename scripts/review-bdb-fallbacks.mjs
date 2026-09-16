/**
 * Fallback dedup review: for every H-number claimed by multiple source rows,
 * show the winner (from the shipped JSON's `row` field) against the losers.
 * Usage: node scripts/review-bdb-fallbacks.mjs [--all] [--sample 40] [--seed 7]
 * Review output goes to stdout; nothing is modified.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src/lib/lexicon/data");
const CSV = join(ROOT, "..", "bdb-hebrew-research", "unabridged-BDB-Hebrew-lexicon.csv");

function normH(p) {
  const m = String(p || "")
    .toUpperCase()
    .match(/^H0*(\d+)$/);
  return m && m[1] !== "0" ? `H${m[1]}` : null;
}
function lemmaOf(html) {
  let c = html.replace(/<h1>.*?<\/h1>/gs, " ");
  c = c.replace(/<div class="navigation">.*?<\/div>/gs, " ");
  const head = (c.match(/<p>(.*?)<\/p>/s) || [])[1] || "";
  for (const m of head.matchAll(/<(bdbheb|bdbarc|bdbare|heb)>(.*?)<\/\1>/gs)) {
    const t = m[2]
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;|&emsp;|&ensp;|&thinsp;/g, " ")
      .trim();
    if (/[\u0590-\u05ea]/.test(t)) return t.slice(0, 40);
  }
  return "";
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const args = process.argv.slice(2);
const showAll = args.includes("--all");
const sampleN = parseInt((args[args.indexOf("--sample") + 1] ?? "40"), 10) || 40;
const seed = parseInt((args[args.indexOf("--seed") + 1] ?? "7"), 10) || 7;

const shipped = JSON.parse(await readFile(join(DIR, "hebrew-bdb.json"), "utf8"));
const csv = await readFile(CSV, "utf8");
const rows = [];
for (const line of csv.split(/\r?\n/)) {
  if (!line.trim()) continue;
  const t1 = line.indexOf("\t");
  const t2 = line.indexOf("\t", t1 + 1);
  if (t1 < 0 || t2 < 0) continue;
  rows.push({
    id: line.slice(0, t1),
    strong: line.slice(t1 + 1, t2),
    html: line.slice(t2 + 1),
  });
}
const claimants = new Map(); // H -> rows
for (const r of rows) {
  for (const p of r.strong.split(/[_\s,;]+/)) {
    const h = normH(p);
    if (!h) continue;
    if (!claimants.has(h)) claimants.set(h, []);
    claimants.get(h).push(r);
  }
}
const multi = [...claimants.entries()].filter(([, rs]) => rs.length > 1);
console.log(`${multi.length} H-numbers claimed by multiple rows`);
const rand = mulberry32(seed);
const pick = showAll
  ? multi
  : (() => {
      const p = [...multi];
      const out = [];
      while (p.length && out.length < sampleN)
        out.push(p.splice(Math.floor(rand() * p.length), 1)[0]);
      return out;
    })();
for (const [h, rs] of pick.sort((a, b) => parseInt(a[0].slice(1)) - parseInt(b[0].slice(1)))) {
  const winner = shipped.by[h]?.row;
  console.log(`\n${h} winner=${winner} shipped_lemma=${shipped.by[h]?.m}`);
  for (const r of rs) {
    console.log(`   ${r.id === winner ? ">" : " "} ${r.id} sn=${r.strong} lemma=${lemmaOf(r.html)}`);
  }
}
