#!/usr/bin/env node
/**
 * Downloads STEPBible lexicon TSVs (CC BY 4.0) into
 * src/lib/lexicon/data/{hebrew,greek,glosses}.json
 * Lexicon data from STEPBible.org / Tyndale House, Cambridge. CC BY 4.0.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src/lib/lexicon/data");

const FILES = [
  {
    id: "tbesh",
    language: "h",
    src: "BDB",
    url: "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Lexicons/TBESH%20-%20Translators%20Brief%20lexicon%20of%20Extended%20Strongs%20for%20Hebrew%20-%20STEPBible.org%20CC%20BY.txt",
  },
  {
    id: "tbesg",
    language: "g",
    src: "AS",
    url: "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Lexicons/TBESG%20-%20Translators%20Brief%20lexicon%20of%20Extended%20Strongs%20for%20Greek%20-%20STEPBible.org%20CC%20BY.txt",
  },
];

function stripHtml(s) {
  return String(s ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeStrongs(raw) {
  const m = String(raw ?? "").toUpperCase().match(/([HG])\s*0*(\d+)/);
  return m ? `${m[1]}${m[2]}` : "";
}

function glossKey(gloss) {
  return String(gloss ?? "").toLowerCase().replace(/[^a-z]+/g, " ").trim();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Theos-Logos lexicon importer (CC BY attribution)" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function parseTsv(text, meta) {
  const entries = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith("H") && !line.startsWith("G")) continue;
    if (!line.includes("\t")) continue;
    const cols = line.split("\t");
    if (cols.length < 7) continue;
    const strongs = normalizeStrongs(cols[0]);
    if (!strongs) continue;
    const lemma = stripHtml(cols[3] ?? "").slice(0, 60);
    const gloss = stripHtml(cols[6] ?? "").slice(0, 80);
    const definition = stripHtml(cols.slice(7).join(" ") || gloss).slice(0, 280);
    if (!definition && !gloss) continue;
    entries.push({
      s: strongs,
      l: meta.language,
      m: lemma,
      g: gloss || definition.slice(0, 60),
      d: definition || gloss,
      src: meta.src,
    });
  }
  return entries;
}

async function main() {
  const collected = [];
  for (const file of FILES) {
    process.stderr.write(`Fetching ${file.id}…\n`);
    try {
      const text = await fetchText(file.url);
      const parsed = parseTsv(text, file);
      process.stderr.write(`  ${parsed.length} rows\n`);
      collected.push(...parsed);
    } catch (err) {
      process.stderr.write(`  skip ${file.id}: ${err.message}\n`);
    }
  }
  if (!collected.length) {
    process.stderr.write("No lexicon rows. Leaving existing data files in place.\n");
    return;
  }
  const by = {};
  for (const e of collected) if (!by[e.s]) by[e.s] = e;
  const heb = {};
  const grk = {};
  const byGloss = {};
  for (const [k, e] of Object.entries(by)) {
    if (k.startsWith("H")) heb[k] = e;
    else grk[k] = e;
    for (const part of e.g.split(/[,;/]/)) {
      const gk = glossKey(part);
      if (gk.length < 3 || gk.length > 20) continue;
      const list = byGloss[gk] ?? [];
      if (!list.includes(e.s) && list.length < 5) list.push(e.s);
      byGloss[gk] = list;
    }
  }
  await mkdir(DIR, { recursive: true });
  await writeFile(join(DIR, "hebrew.json"), JSON.stringify(heb));
  await writeFile(join(DIR, "greek.json"), JSON.stringify(grk));
  await writeFile(
    join(DIR, "glosses.json"),
    JSON.stringify({
      attribution:
        "Lexicon data from STEPBible.org by Tyndale House, Cambridge. Licensed under CC BY 4.0.",
      byGloss,
    }),
  );
  process.stderr.write(
    `Wrote hebrew ${Object.keys(heb).length}, greek ${Object.keys(grk).length}, glosses ${Object.keys(byGloss).length}\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(0);
});
