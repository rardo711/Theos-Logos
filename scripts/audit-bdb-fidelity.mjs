/**
 * BDB fidelity audit — stratified word-for-word check of the shipped JSON
 * against the source CSV, plus a mutation positive-control.
 *
 * For each sampled Strong's number it loads the winner source row recorded in
 * the JSON (`row: "BDB123"`), strips that row's HTML with a small INDEPENDENT
 * stripper, and requires every shipped word (lemma, gloss, POS, senses) to
 * appear in the source in the same order — no invented, paraphrased, or
 * reordered wording. Truncation of long entries is allowed (the importer caps
 * total text); invention is not.
 *
 * Usage:
 *   node scripts/audit-bdb-fidelity.mjs [--sample 250] [--seed 7]
 *   node scripts/audit-bdb-fidelity.mjs --mutate H430   # positive control:
 *       tampers with one entry in memory; the audit MUST flag it.
 *
 * Exit 0 = faithful (or tamper caught with --mutate). Exit 1 otherwise.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src/lib/lexicon/data");
const CSV = join(ROOT, "..", "bdb-hebrew-research", "unabridged-BDB-Hebrew-lexicon.csv");

/** Independent tag strip: refs keep inner text, entities decoded. */
function stripSource(html) {
  let out = html.replace(/<h1>.*?<\/h1>/gs, " ");
  out = out.replace(/<div class="navigation">.*?<\/div>/gs, " ");
  // The importer strips <lookup> wrappers but keeps their inner text.
  out = out.replace(/<ref\s+[^>]*>(.*?)<\/ref>/gs, " $1 ");
  out = out.replace(/<[^>]+>/g, " ");
  out = out
    .replace(/&nbsp;|&emsp;|&ensp;|&thinsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return out.replace(/\s+/g, " ").trim();
}

/** Word tokens: split on whitespace, trim surrounding punctuation. */
function words(s) {
  return String(s)
    .replace(/¶/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, ""))
    .filter((w) => w.length > 0);
}

/** True when every word of `a` appears in `b` in the same order. */
function isSubsequence(a, b) {
  let j = 0;
  for (const w of a) {
    while (j < b.length && b[j] !== w) j++;
    if (j >= b.length) return w; // the first missing/out-of-order word
    j++;
  }
  return null;
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

async function main() {
  const args = process.argv.slice(2);
  const flag = (name, def) => {
    const i = args.indexOf(name);
    if (i < 0 || i + 1 >= args.length) return def;
    const n = name === "--mutate" ? args[i + 1].toUpperCase() : parseInt(args[i + 1], 10);
    return Number.isNaN(n) ? def : n;
  };
  const mutateId = flag("--mutate", "");
  const sampleN = flag("--sample", 250);
  const seed = flag("--seed", 7);

  const shipped = JSON.parse(await readFile(join(DIR, "hebrew-bdb.json"), "utf8"));
  const by = shipped.by;

  if (mutateId) {
    const e = by[mutateId];
    if (!e) throw new Error(`cannot mutate: ${mutateId} not in JSON`);
    // In-memory tamper only; the file on disk is untouched.
    e.ss[1] = { ...e.ss[1], t: e.ss[1].t.replace(/\S+/, "TAMPERED") };
    process.stderr.write(`  (positive control: in-memory tamper of ${mutateId})\n`);
  }

  let csvText;
  try {
    csvText = await readFile(CSV, "utf8");
  } catch {
    throw new Error(`source CSV not found at ${CSV}`);
  }
  const rows = new Map(); // BDB id -> { strong, html }
  for (const line of csvText.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const t1 = line.indexOf("\t");
    const t2 = line.indexOf("\t", t1 + 1);
    if (t1 < 0 || t2 < 0) continue;
    rows.set(line.slice(0, t1), {
      strong: line.slice(t1 + 1, t2),
      html: line.slice(t2 + 1),
    });
  }

  // Stratified sample: 9 numeric bands + Biblical Aramaic stratum.
  const ids = Object.keys(by).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  const perBand = Math.max(1, Math.floor(sampleN / 10));
  const rand = mulberry32(seed);
  const pick = (pool, n) => {
    const p = [...pool];
    const out = [];
    while (p.length && out.length < n) {
      out.push(p.splice(Math.floor(rand() * p.length), 1)[0]);
    }
    return out;
  };
  const sampled = new Set();
  for (let i = 0; i < 9; i++) {
    const lo = i * 1000 + 1;
    const hi = i === 8 ? 99999 : (i + 1) * 1000;
    pick(
      ids.filter((id) => {
        const n = parseInt(id.slice(1));
        return n >= lo && n <= hi;
      }),
      perBand,
    ).forEach((id) => sampled.add(id));
  }
  pick(
    ids.filter((id) => by[id].lang === "aramaic"),
    perBand,
  ).forEach((id) => sampled.add(id));
  // Always include the high-risk homograph / cross-ref cases.
  for (const id of ["H430", "H1254", "H7225", "H216", "H157"]) sampled.add(id);

  const failures = [];
  let glossCount = 0;
  let wordCount = 0;
  for (const id of [...sampled].sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)))) {
    const e = by[id];
    const row = rows.get(e.row);
    if (!row) {
      failures.push(`${id}: winner row ${e.row} not in CSV`);
      continue;
    }
    // The winner row must actually claim this H-number.
    const claimed = row.strong.split(/[_\s,;]+/).some((p) => {
      const m = p.toUpperCase().match(/^H0*(\d+)$/);
      return m && m[1] !== "0" && "H" + m[1] === id;
    });
    if (!claimed) {
      failures.push(`${id}: winner row ${e.row} does not claim ${id}`);
      continue;
    }
    const srcWords = words(stripSource(row.html));
    // Each shipped component must be a word-subsequence of the source.
    // Checked independently because the head block repeats head material
    // (lemma/POS) and glosses are drawn from later senses.
    const parts = [
      ["lemma", e.m || ""],
      ["headword gloss", e.hw || ""],
      ["part of speech", (e.pos || []).join(" ")],
      ["occurrence count", e.occ || ""],
      ["head block", (e.ss[0] || {}).t || ""],
    ];
    e.ss.forEach((s, i) => {
      if (i > 0) parts.push([`sense block ${i}`, s.t || ""]);
      (s.g || []).forEach((g, gi) => parts.push([`gloss ${i}.${gi}`, g]));
    });
    for (const [label, text] of parts) {
      const w = words(text);
      wordCount += w.length;
      if (label.startsWith("gloss") || label === "headword gloss") glossCount++;
      if (!w.length) continue;
      const bad = isSubsequence(w, srcWords);
      if (bad) {
        failures.push(`${id} (${e.row}): ${label} word ${JSON.stringify(bad)} not faithful to source order`);
        break;
      }
    }
  }

  console.log(`BDB fidelity audit — sampled ${sampled.size} entries (seed ${seed})`);
  console.log(`  shipped words checked: ${wordCount}, glosses checked: ${glossCount}`);
  if (mutateId) {
    const caught = failures.some((f) => f.startsWith(mutateId));
    console.log(`  positive control (${mutateId} tampered): ${caught ? "CAUGHT ✓" : "MISSED ✗"}`);
    const others = failures.filter((f) => !f.startsWith(mutateId));
    if (!caught || others.length) {
      console.log("  FAIL: harness did not behave as expected");
      others.slice(0, 10).forEach((f) => console.log(`    ${f}`));
      process.exit(1);
    }
    console.log("  PASS: harness detects tampering, all else faithful");
    return;
  }
  if (failures.length) {
    console.log(`  FAILURES (${failures.length}):`);
    failures.slice(0, 20).forEach((f) => console.log(`    ${f}`));
    process.exit(1);
  }
  console.log("  PASS: all sampled entries word-for-word faithful to source");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
