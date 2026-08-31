#!/usr/bin/env node
/**
 * Downloads STEPBible lexicon TSVs (CC BY 4.0) and writes a compact JSON index.
 * Run: npm run lexicon:import
 *
 * Sources:
 *   TBESH — abridged BDB (Hebrew)
 *   TBESG — Abbott-Smith brief Greek
 *   TFLSJ — formatted LSJ for biblical Greek
 *
 * Lexicon data from STEPBible.org / Tyndale House, Cambridge. CC BY 4.0.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/lib/lexicon/data/stepbible.json");
const CACHE = join(ROOT, "scripts/.cache/stepbible");

const FILES = [
  {
    id: "tbesh",
    language: "hebrew",
    source: "TBESH (abridged BDB)",
    url: "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Lexicons/TBESH%20-%20Translators%20Brief%20lexicon%20of%20Extended%20Strongs%20for%20Hebrew%20-%20STEPBible.org%20CC%20BY.txt",
  },
  {
    id: "tbesg",
    language: "greek",
    source: "TBESG (Abbott-Smith)",
    url: "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Lexicons/TBESG%20-%20Translators%20Brief%20lexicon%20of%20Extended%20Strongs%20for%20Greek%20-%20STEPBible.org%20CC%20BY.txt",
  },
  {
    id: "tflsj",
    language: "greek",
    source: "TFLSJ (LSJ)",
    url: "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/Lexicons/TFLSJ%200-5624%20-%20Translators%20Formatted%20full%20LSJ%20Bible%20lexicon%20-%20STEPBible.org%20CC%20BY.txt",
  },
];

function stripHtml(s) {
  return String(s ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeStrongs(raw) {
  const m = String(raw ?? "").toUpperCase().match(/([HG])\s*0*(\d+)/);
  if (!m) return "";
  return `${m[1]}${m[2]}`;
}

function glossKey(gloss) {
  return String(gloss ?? "")
    .toLowerCase()
    .replace(/[^a-z]+/g, " ")
    .trim();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Theos-Logos lexicon importer (CC BY attribution)" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function parseTsv(text, meta) {
  const lines = text.split(/\r?\n/);
  const entries = [];
  let header = null;
  for (const line of lines) {
    if (!line || line.startsWith("#")) continue;
    const cols = line.split("\t");
    if (!header) {
      const joined = cols.join(" ").toLowerCase();
      if (
        joined.includes("strong") ||
        joined.includes("estrong") ||
        joined.includes("hebrew") ||
        joined.includes("greek")
      ) {
        header = cols.map((c) => c.trim().toLowerCase());
        continue;
      }
    }
    if (cols.length < 4) continue;
    const eStrong = cols[0] ?? "";
    const lemma = cols[3] ?? cols[2] ?? "";
    const translit = cols[4] ?? "";
    const morph = cols[5] ?? "";
    const gloss = cols[6] ?? "";
    const meaning = cols.slice(7).join(" ");
    const strongs = normalizeStrongs(eStrong);
    if (!strongs) continue;
    const definition = stripHtml(meaning || gloss);
    const shortGloss = stripHtml(gloss) || definition.slice(0, 80);
    if (!definition && !shortGloss) continue;
    entries.push({
      strongs,
      language: meta.language,
      source: meta.source,
      lemma: stripHtml(lemma),
      transliteration: stripHtml(translit),
      morphology: stripHtml(morph),
      gloss: shortGloss.slice(0, 160),
      definition: definition.slice(0, 1200),
    });
  }
  return entries;
}

function merge(all) {
  const byStrongs = {};
  const byGloss = {};
  for (const e of all) {
    const existing = byStrongs[e.strongs];
    if (!existing) {
      byStrongs[e.strongs] = e;
    } else if (e.source.includes("LSJ") && !existing.lsj) {
      existing.lsj = e.definition.slice(0, 800);
    } else if (e.definition.length > (existing.definition?.length ?? 0)) {
      byStrongs[e.strongs] = { ...e, lsj: existing.lsj };
    }
    for (const part of e.gloss.split(/[,;/]/)) {
      const k = glossKey(part);
      if (k.length < 3 || k.length > 24) continue;
      const list = byGloss[k] ?? [];
      if (!list.includes(e.strongs) && list.length < 8) list.push(e.strongs);
      byGloss[k] = list;
    }
  }
  return { byStrongs, byGloss };
}

async function main() {
  await mkdir(CACHE, { recursive: true });
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
    throw new Error("No lexicon rows imported. Check network / STEPBible URLs.");
  }
  const index = {
    attribution:
      "Lexicon data from STEPBible.org by Tyndale House, Cambridge. Licensed under CC BY 4.0.",
    generatedAt: new Date().toISOString(),
    counts: { entries: collected.length },
    ...merge(collected),
  };
  index.counts.strongs = Object.keys(index.byStrongs).length;
  index.counts.glosses = Object.keys(index.byGloss).length;
  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(index));
  process.stderr.write(
    `Wrote ${OUT} (${index.counts.strongs} Strong's, ${index.counts.glosses} gloss keys)\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
