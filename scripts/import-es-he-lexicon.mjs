#!/usr/bin/env node
/**
 * Build the Spanish OT Hebrew lexicon layer for Theos Logos.
 *
 * Two human-compiled sources, each shipped verbatim under its own
 * attribution — NEVER machine-translated, NEVER paraphrased:
 *
 * 1. Spanish short glosses from bcv-data/strongs `glosses/spa.tsv`
 *    (https://huggingface.co/datasets/bcv-commons/strongs). Kept rows are
 *    lexicon-method (or ubs-dict source) rows only — llm-only rows are
 *    dropped, same rule as scripts/import-ubs-es-lexicon.mjs. License:
 *    CC BY-SA 4.0 (dataset README; ubs-dict source = UBS dictionaries,
 *    CC BY-SA 4.0; stepbible source = CC BY 4.0). Share-alike: this JSON
 *    is a derivative of CC BY-SA 4.0 material and stays under CC BY-SA 4.0.
 *
 * 2. Reina-Valera 1909 renderings from bcv-data/strongs `surfaces/spa.tsv`
 *    (base_text=RV09, Clear-Bible/Alignments; all rows human-verified).
 *    The RV09 translation text itself is public domain (1909). Top
 *    renderings per Strong's number by occurrence count.
 *
 * Run locally / on the box — DO NOT download at Vercel build.
 * Outputs: src/lib/lexicon/data/spanish-hebrew.json
 *
 * The BDB full entries and verse-sense one-liner live in hebrew-bdb.json
 * (same feature branch); this file only adds the Spanish layer and points
 * at it by Strong's number. Entries with neither Spanish signal still ship
 * (src: []) so the card's fallback chain (RV09 → BDB English, labeled)
 * never renders blank.
 *
 * Fidelity rules (Gerardo's standing condition: faithful to the original):
 * 1. Every Spanish string is verbatim from the TSVs. No translation, no
 *    paraphrase, no generated wording — the card labels the glossEs hero
 *    honestly as a "Glosa" (gloss), never as a definition and never as
 *    "Strong's en español".
 * 2. llm-method rows are excluded. human-verified surfaces only.
 * 3. One-char/two-char alignment noise ("la", "a") is dropped from the
 *    RV09 rendering lists; everything else ships with its count untouched.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src/lib/lexicon/data");
const RESEARCH = join(ROOT, "..", "bdb-hebrew-research");

const GLOSS_URL =
  "https://huggingface.co/datasets/bcv-commons/strongs/resolve/main/glosses/spa.tsv";
const SURFACE_URL =
  "https://huggingface.co/datasets/bcv-commons/strongs/resolve/main/surfaces/spa.tsv";
const DATASET_URL = "https://huggingface.co/datasets/bcv-commons/strongs";

const ATTRIBUTION =
  "Spanish glosses: bcv-data/strongs contributors, CC BY-SA 4.0. " +
  "Spanish renderings: Reina-Valera 1909, public domain (1909).";
const RV09_ATTRIBUTION = "Reina-Valera 1909, public domain.";

function normalizeStrongs(raw) {
  const m = String(raw ?? "")
    .toUpperCase()
    .match(/H\s*0*(\d+)/);
  return m && m[1] !== "0" ? `H${m[1]}` : "";
}

async function loadTsv(name, url) {
  const local = join(RESEARCH, name);
  try {
    const text = await readFile(local, "utf8");
    process.stderr.write(`  using local ${local}\n`);
    return text;
  } catch {
    process.stderr.write(`  fetching ${url}\n`);
    const res = await fetch(url, {
      headers: { "User-Agent": "Theos-Logos ES-HE importer (CC BY-SA 4.0)" },
    });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    const text = await res.text();
    await mkdir(RESEARCH, { recursive: true });
    await writeFile(local, text);
    process.stderr.write(`  cached to ${local}\n`);
    return text;
  }
}

function cleanText(s, cap) {
  const t = String(s ?? "")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > cap ? t.slice(0, cap).trimEnd() : t;
}

/**
 * Keep lexicon-method rows (or ubs-dict source) — the exact rule from
 * scripts/import-ubs-es-lexicon.mjs. llm-only rows are dropped. First
 * gloss wins per Strong's number.
 */
function parseGlosses(text) {
  const gloss = {};
  let hRows = 0;
  let kept = 0;
  let llmSkipped = 0;
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const cols = line.split("\t");
    if (cols[0] === "strong") continue;
    if (cols.length < 5) continue;
    const [strong, , g, methods, sources] = cols;
    const id = normalizeStrongs(strong);
    if (!id) continue;
    hRows += 1;
    const mset = new Set(String(methods).split(";").filter(Boolean));
    const sset = new Set(String(sources).split(";").filter(Boolean));
    if (!(mset.has("lexicon") || sset.has("ubs-dict"))) {
      llmSkipped += 1;
      continue;
    }
    const text = cleanText(g, 80);
    if (!text) continue;
    if (!gloss[id]) {
      gloss[id] = text;
      kept += 1;
    }
  }
  return { gloss, hRows, kept, llmSkipped };
}

/**
 * Group human-verified RV09 surfaces per Strong's number, top 5 by count.
 * One/two-char tokens are alignment noise ("la", "a") and are dropped —
 * but only when the entry has longer renderings; interjections and
 * particles whose ONLY renderings are short ("ay", "oh") keep them,
 * since the short form genuinely is the translation.
 */
function parseSurfaces(text) {
  const per = {};
  let hRows = 0;
  let nonHuman = 0;
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const cols = line.split("\t");
    if (cols[0] === "strong") continue;
    if (cols.length < 7) continue;
    const [strong, , surface, count, , , review] = cols;
    const id = normalizeStrongs(strong);
    if (!id) continue;
    hRows += 1;
    if (String(review).trim() !== "human-verified") {
      nonHuman += 1;
      continue;
    }
    const t = cleanText(surface, 60);
    if (!t) continue;
    const c = parseInt(String(count), 10);
    if (!Number.isFinite(c) || c < 1) continue;
    (per[id] ??= []).push([t, c]);
  }
  const surfaces = {};
  for (const [id, rows] of Object.entries(per)) {
    const hasLong = rows.some(([t]) => t.length >= 3);
    const kept = hasLong ? rows.filter(([t]) => t.length >= 3) : rows;
    kept.sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
    surfaces[id] = kept.slice(0, 5);
  }
  return { surfaces, hRows, nonHuman };
}

/**
 * Loud hygiene: no tags, entities, or control chars in shipped strings.
 * A bare ">" is the source lexicons' own sense-development marker
 * ("destapar los oídos > abrir los oídos") and is kept verbatim; "<"
 * never occurs legitimately in these files, so any "<" is a tag leak.
 */
function assertClean(strings) {
  const bad = [];
  for (const s of strings) {
    if (s.includes("<") || /&(?:[a-z]+|#\d+);/i.test(s) || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s)) {
      bad.push(s.slice(0, 60));
      if (bad.length >= 5) break;
    }
  }
  if (bad.length) {
    throw new Error(
      `hygiene failure in Spanish strings (tags/entities/controls): ${JSON.stringify(bad)}`,
    );
  }
}

function spanishGlossKey(word) {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-zñ]+/g, " ")
    .trim();
}

function buildGlossIndex(by) {
  const byGloss = Object.create(null);
  for (const [id, e] of Object.entries(by)) {
    const words = [];
    if (e.glossEs) words.push(e.glossEs);
    for (const [t] of e.rv09 || []) words.push(t);
    for (const w of words) {
      const key = spanishGlossKey(w);
      if (key.length < 2 || key.length > 24) continue;
      const list = byGloss[key] ?? [];
      if (!list.includes(id) && list.length < 5) list.push(id);
      byGloss[key] = list;
    }
  }
  return byGloss;
}

async function main() {
  process.stderr.write("Importing Spanish OT Hebrew lexicon layer…\n");

  const glossText = await loadTsv("strongs_spa_glosses.tsv", GLOSS_URL);
  const { gloss, hRows: glossRows, kept, llmSkipped } = parseGlosses(glossText);
  process.stderr.write(
    `  glosses: ${glossRows} H rows, kept ${kept}, llm-only skipped ${llmSkipped}, unique ${Object.keys(gloss).length}\n`,
  );
  if (glossRows < 8000) {
    throw new Error(
      `glosses/spa.tsv yielded only ${glossRows} H rows (expected ~10354); upstream format may have changed — refusing to ship a thin layer.`,
    );
  }

  const surfaceText = await loadTsv("strongs_spa_surfaces.tsv", SURFACE_URL);
  const {
    surfaces,
    hRows: surfaceRows,
    nonHuman,
  } = parseSurfaces(surfaceText);
  process.stderr.write(
    `  surfaces: ${surfaceRows} H rows, non-human skipped ${nonHuman}, unique ${Object.keys(surfaces).length}\n`,
  );
  if (surfaceRows < 7000) {
    throw new Error(
      `surfaces/spa.tsv yielded only ${surfaceRows} H rows (expected ~51537); upstream format may have changed — refusing to ship a thin layer.`,
    );
  }

  const glossIds = Object.keys(gloss);
  const surfaceIds = Object.keys(surfaces);
  if (glossIds.length < 7000) {
    throw new Error(
      `only ${glossIds.length} unique gloss H-numbers (expected ~7134); refusing to ship.`,
    );
  }
  if (surfaceIds.length < 7500) {
    throw new Error(
      `only ${surfaceIds.length} unique surface H-numbers (expected ~7652); refusing to ship.`,
    );
  }
  const union = new Set([...glossIds, ...surfaceIds]);
  process.stderr.write(`  union with a Spanish signal: ${union.size}\n`);
  if (union.size < 8300) {
    throw new Error(
      `union coverage only ${union.size} (expected ~8314); refusing to ship.`,
    );
  }

  // Keyspace: every Strong's number in hebrew-bdb.json, so gap entries
  // (neither Spanish signal) still resolve and the card falls back cleanly.
  const hebrewRaw = await readFile(join(DIR, "hebrew-bdb.json"), "utf8");
  const hebrewIds = Object.keys(JSON.parse(hebrewRaw).by ?? {});
  if (hebrewIds.length < 8600) {
    throw new Error(
      `hebrew-bdb.json has only ${hebrewIds.length} entries; run the BDB import first.`,
    );
  }

  const by = {};
  const cleanPool = [];
  for (const id of hebrewIds) {
    const e = { s: id, src: [] };
    if (gloss[id]) {
      e.glossEs = gloss[id];
      e.src.push("gloss");
      cleanPool.push(gloss[id]);
    }
    if (surfaces[id]) {
      e.rv09 = surfaces[id];
      e.src.push("rv09");
      for (const [t] of surfaces[id]) cleanPool.push(t);
    }
    by[id] = e;
  }
  assertClean(cleanPool);

  const byGloss = buildGlossIndex(by);
  const out = {
    attribution: ATTRIBUTION,
    license: "CC BY-SA 4.0",
    source: DATASET_URL,
    merge:
      "glossEs: glosses/spa.tsv lexicon-method rows (llm excluded), first wins; " +
      "rv09: surfaces/spa.tsv human-verified RV09 renderings, top 5 by count; " +
      "gap entries (src: []) fall back to BDB English, labeled.",
    sources: {
      glossEs: {
        name: "bcv-data/strongs glosses/spa.tsv",
        url: `${DATASET_URL}/blob/main/glosses/spa.tsv`,
        license: "CC BY-SA 4.0",
        note: "Human lexicon glosses (ubs-dict / stepbible); llm rows excluded.",
      },
      rv09: {
        name: "Reina-Valera 1909 via bcv-data/strongs surfaces/spa.tsv",
        url: `${DATASET_URL}/blob/main/surfaces/spa.tsv`,
        license: "Reina-Valera text: public domain (1909); dataset: CC BY-SA 4.0",
        note: "Human-verified alignment renderings with occurrence counts.",
      },
    },
    rv09Attribution: RV09_ATTRIBUTION,
    by,
    byGloss,
  };
  await mkdir(DIR, { recursive: true });
  const path = join(DIR, "spanish-hebrew.json");
  await writeFile(path, JSON.stringify(out));
  const bytes = Buffer.byteLength(JSON.stringify(out));
  process.stderr.write(
    `Wrote ${path} (${hebrewIds.length} strongs, ${Object.keys(byGloss).length} gloss keys, ${Math.round(bytes / 1024)} KB)\n`,
  );
  const sample = by.H2377;
  process.stderr.write(
    `  sample H2377 glossEs: ${JSON.stringify(sample?.glossEs)} rv09: ${JSON.stringify(sample?.rv09)}\n`,
  );
  const gap = hebrewIds.filter((id) => by[id].src.length === 0).length;
  process.stderr.write(`  gap entries (no Spanish signal): ${gap}\n`);
}

main().catch((err) => {
  process.stderr.write(`\nFATAL: ${err.message}\n`);
  process.exit(1);
});
