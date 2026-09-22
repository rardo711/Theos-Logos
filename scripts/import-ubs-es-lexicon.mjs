#!/usr/bin/env node
/**
 * Build compact Spanish NT lexicon from UBS Greek NT Dictionary (es)
 * + filtered bcv-commons/strongs spa.tsv secondary short glosses.
 *
 * Run locally / on the box — DO NOT download at Vercel build.
 * Outputs: src/lib/lexicon/data/spanish.json
 *
 * UBS Greek NT Dictionary (Spanish) © United Bible Societies. CC BY-SA 4.0.
 * https://github.com/ubsicap/ubs-open-license
 *
 * Merge rules:
 * 1. PRIMARY — UBS ES JSON keyed by Strong's (G####, unpadded).
 * 2. SECONDARY — spa.tsv rows where methods contains "lexicon" OR sources
 *    contains "ubs-dict". LLM-only rows are excluded from v1.
 * 3. spa short gloss (sg) is attached when present; used as hero gloss only
 *    when a UBS sense has no Glosses.
 * 4. Domains / SubDomains / LEXEntryCode / verse-level LEXReferences (SIL
 *    BBBCCCVVV) are retained per sense for verse-aware sense pick.
 * 5. Domains / POS come from UBS BaseForms / LEXMeanings (inline).
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src/lib/lexicon/data");
const RESEARCH = join(ROOT, "..", "es-lexicon-research");

const UBS_URL =
  "https://raw.githubusercontent.com/ubsicap/ubs-open-license/main/dictionaries/greek/JSON/UBSGreekNTDic-v1.0-es.JSON";
const SPA_URL =
  "https://huggingface.co/datasets/bcv-commons/strongs/resolve/main/glosses/spa.tsv";

const ATTRIBUTION =
  "UBS Greek NT Dictionary (Spanish) © United Bible Societies. Licensed under CC BY-SA 4.0.";

function normalizeStrongs(raw) {
  const m = String(raw ?? "")
    .toUpperCase()
    .match(/G\s*0*(\d+)/);
  return m ? `G${m[1]}` : "";
}

function cleanText(s, max = 280) {
  let t = String(s ?? "");
  t = t.replace(/\{[A-Z]:[^}]*\}/g, "");
  t = t.replace(/<[^>]+>/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t.slice(0, max);
}

function glossKey(gloss) {
  return String(gloss ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-zñ]+/g, " ")
    .trim();
}

async function loadJson(localName, url) {
  const local = join(RESEARCH, localName);
  try {
    const text = await readFile(local, "utf8");
    process.stderr.write(`  using local ${localName}\n`);
    return JSON.parse(text);
  } catch {
    process.stderr.write(`  fetching ${url}\n`);
    const res = await fetch(url, {
      headers: { "User-Agent": "Theos-Logos ES lexicon importer (CC BY-SA attribution)" },
    });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json();
  }
}

async function loadText(localName, url) {
  const local = join(RESEARCH, localName);
  try {
    const text = await readFile(local, "utf8");
    process.stderr.write(`  using local ${localName}\n`);
    return text;
  } catch {
    process.stderr.write(`  fetching ${url}\n`);
    const res = await fetch(url, {
      headers: { "User-Agent": "Theos-Logos ES lexicon importer (CC BY-SA attribution)" },
    });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.text();
  }
}

/** SIL/UBS verse key BBBCCCVVV (9 digits) from a full LEXReferences token. */
function silVerseKey(ref) {
  const s = String(ref ?? "").replace(/\D/g, "");
  return s.length >= 9 ? s.slice(0, 9) : "";
}

function parseUbs(entries) {
  /** @type {Record<string, object>} */
  const by = {};
  for (const e of entries) {
    const codes = [...new Set((e.StrongCodes || []).map(normalizeStrongs).filter(Boolean))];
    if (!codes.length) continue;
    const lemma = String(e.Lemma || "").slice(0, 80);
    const pos = [];
    const senses = [];
    for (const bf of e.BaseForms || []) {
      for (const p of bf.PartsOfSpeech || []) {
        if (p && !pos.includes(p) && pos.length < 4) pos.push(String(p).slice(0, 40));
      }
      for (const lm of bf.LEXMeanings || []) {
        const domains = (lm.LEXDomains || [])
          .map((d) => d?.Domain)
          .filter(Boolean)
          .slice(0, 2)
          .map((d) => String(d).slice(0, 80));
        const subdomains = (lm.LEXSubDomains || [])
          .map((d) => d?.Domain)
          .filter(Boolean)
          .slice(0, 2)
          .map((d) => String(d).slice(0, 120));
        const code = lm.LEXEntryCode != null ? String(lm.LEXEntryCode).slice(0, 16) : "";
        // Verse-level SIL prefixes (BBBCCCVVV) for sense-by-verse fidelity.
        const rv = [
          ...new Set(
            (lm.LEXReferences || [])
              .map(silVerseKey)
              .filter(Boolean),
          ),
        ];
        for (const sense of lm.LEXSenses || []) {
          if ((sense.LanguageCode || "es") !== "es") continue;
          const glosses = (sense.Glosses || [])
            .map((g) => cleanText(g, 80))
            .filter(Boolean)
            .slice(0, 8);
          const dshort = cleanText(sense.DefinitionShort || "", 280);
          if (!glosses.length && !dshort) continue;
          if (senses.length >= 12) continue;
          senses.push({
            g: glosses,
            d: dshort,
            ...(domains.length ? { dom: domains } : {}),
            ...(subdomains.length ? { sub: subdomains } : {}),
            ...(code ? { code } : {}),
            ...(rv.length ? { rv } : {}),
          });
        }
      }
    }
    if (!senses.length && !lemma) continue;
    const entry = {
      s: codes[0],
      m: lemma,
      ...(pos.length ? { pos } : {}),
      ss: senses,
      ...(codes.length > 1 ? { sc: codes.slice(0, 4) } : {}),
      src: "ubs",
    };
    for (const c of codes) {
      if (!by[c]) by[c] = { ...entry, s: c };
    }
  }
  return by;
}

/**
 * Keep spa.tsv rows with lexicon method OR ubs-dict source. Drop llm-only.
 */
function parseSpa(text) {
  /** @type {Record<string, string>} */
  const short = {};
  let kept = 0;
  let skipped = 0;
  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const cols = line.split("\t");
    if (cols[0] === "strong") continue;
    if (cols.length < 5) continue;
    const [strong, , gloss, methods, sources] = cols;
    const mset = new Set(String(methods).split(";").filter(Boolean));
    const sset = new Set(String(sources).split(";").filter(Boolean));
    const ok = mset.has("lexicon") || sset.has("ubs-dict");
    if (!ok) {
      skipped += 1;
      continue;
    }
    const id = normalizeStrongs(strong);
    const g = cleanText(gloss, 80);
    if (!id || !g) continue;
    if (!short[id]) short[id] = g;
    kept += 1;
  }
  return { short, kept, skipped };
}

/** Content stopwords for multi-word gloss key tokenization (Spanish). */
const GLOSS_STOP = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas",
  "de", "del", "al", "a", "y", "o", "en", "por", "con",
  "su", "sus", "lo", "le", "se", "que", "para", "como",
  "mas", "muy", "ya", "si", "no", "eso", "esta", "este",
]);

const MAX_GLOSS_HITS = 8;

/**
 * Spanish singular/plural heuristics derived from an existing gloss key.
 * Source-faithful: only morphs of keys already present — no invented gloss text.
 */
function numberVariants(key) {
  const out = new Set();
  if (!key || key.includes(" ")) return out;
  const w = key;
  out.add(w);
  // Pluralize
  if (w.endsWith("z") && w.length > 2) out.add(w.slice(0, -1) + "ces");
  else if ((w.endsWith("cion") || w.endsWith("sion") || w.endsWith("ion")) && w.length > 4)
    out.add(w + "es");
  else if (/[aeiou]$/.test(w)) out.add(w + "s");
  else if (/[nrljdys]$/.test(w) && w.length > 2) out.add(w + "es");
  // Singularize
  if (w.endsWith("ces") && w.length > 4) out.add(w.slice(0, -3) + "z");
  else if (w.endsWith("iones") && w.length > 6) out.add(w.slice(0, -2)); // -iones → -ion
  else if (w.endsWith("es") && w.length > 3) {
    const stem = w.slice(0, -2);
    if (/[nrljdys]$/.test(stem)) out.add(stem);
  }
  if (w.endsWith("s") && !w.endsWith("es") && !w.endsWith("us") && w.length > 2) {
    out.add(w.slice(0, -1));
  }
  return out;
}

/** Whole content tokens of a multi-word gloss key (e.g. "el evangelio" → "evangelio"). */
function contentTokens(key) {
  const out = new Set();
  const parts = key.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return out;
  for (const p of parts) {
    if (p.length < 2 || p.length > 24) continue;
    if (GLOSS_STOP.has(p)) continue;
    out.add(p);
  }
  return out;
}

function pushGloss(byGloss, key, id, { front = false } = {}) {
  if (!key || key.length < 2 || key.length > 24) return;
  const list = byGloss[key] ?? [];
  if (list.includes(id)) {
    if (front) {
      byGloss[key] = [id, ...list.filter((x) => x !== id)].slice(0, MAX_GLOSS_HITS);
    }
    return;
  }
  if (front) {
    byGloss[key] = [id, ...list].slice(0, MAX_GLOSS_HITS);
  } else if (list.length < MAX_GLOSS_HITS) {
    list.push(id);
    byGloss[key] = list;
  }
}

function buildGlossIndex(by) {
  /** @type {Record<string, string[]>} */
  const byGloss = Object.create(null);
  for (const [id, e] of Object.entries(by)) {
    const glosses = [];
    for (const sense of e.ss || []) {
      for (const g of sense.g || []) glosses.push(g);
    }
    if (e.sg) glosses.push(e.sg);
    for (const g of glosses) {
      const key = glossKey(g);
      if (key.length < 2 || key.length > 24) continue;
      pushGloss(byGloss, key, id);
      // Multi-word key tokens (9% of Muse collisions)
      for (const tok of contentTokens(key)) pushGloss(byGloss, tok, id);
    }
  }
  // Singular/plural variants of every existing key (32% of Muse collisions)
  for (const key of Object.keys(byGloss)) {
    const ids = byGloss[key];
    for (const variant of numberVariants(key)) {
      if (variant === key) continue;
      for (const id of ids) pushGloss(byGloss, variant, id);
    }
  }
  return byGloss;
}

/**
 * Apply curated headword → Strong's edges (key only; entry content untouched).
 * Prepends so verse-aware lookup can discover the should-win Strong's.
 */
function applyCuratedEdges(byGloss, by, edges) {
  let applied = 0;
  let skipped = 0;
  for (const [rawKey, ids] of Object.entries(edges || {})) {
    if (rawKey.startsWith("_")) continue;
    const key = glossKey(rawKey);
    if (!key) continue;
    for (const rawId of ids || []) {
      const id = normalizeStrongs(rawId);
      if (!id || !by[id]) {
        skipped += 1;
        process.stderr.write(`  edge skip ${key}→${rawId} (missing entry)\n`);
        continue;
      }
      pushGloss(byGloss, key, id, { front: true });
      applied += 1;
    }
  }
  return { applied, skipped };
}

async function main() {
  process.stderr.write("Importing UBS ES + spa.tsv…\n");
  const ubs = await loadJson("UBSGreekNTDic-v1.0-es.JSON", UBS_URL);
  if (!Array.isArray(ubs)) throw new Error("UBS JSON is not an array");
  const by = parseUbs(ubs);
  process.stderr.write(`  UBS primary entries: ${Object.keys(by).length}\n`);

  const spaText = await loadText("spa_glosses.tsv", SPA_URL);
  const { short, kept, skipped } = parseSpa(spaText);
  process.stderr.write(`  spa.tsv kept ${kept}, llm-only skipped ${skipped}, unique ${Object.keys(short).length}\n`);

  let spaFilled = 0;
  let spaOnly = 0;
  for (const [id, g] of Object.entries(short)) {
    if (by[id]) {
      by[id].sg = g;
      spaFilled += 1;
    } else {
      // Secondary-only gap fill (rare): short gloss as sole sense.
      by[id] = {
        s: id,
        m: "",
        ss: [{ g: [g], d: "" }],
        src: "spa",
        sg: g,
      };
      spaOnly += 1;
    }
  }
  process.stderr.write(`  spa attached to UBS ${spaFilled}, spa-only gaps ${spaOnly}\n`);

  const byGloss = buildGlossIndex(by);
  process.stderr.write(`  gloss index (enriched): ${Object.keys(byGloss).length} keys\n`);

  // Curated index-key edges (Muse audit / Chief) — key only, entry content untouched.
  let curatedPath = join(ROOT, "scripts/data/spanish-gloss-edges.json");
  let curatedEdges = {};
  try {
    const curatedRaw = JSON.parse(await readFile(curatedPath, "utf8"));
    curatedEdges = curatedRaw.edges || curatedRaw;
    const { applied, skipped } = applyCuratedEdges(byGloss, by, curatedEdges);
    process.stderr.write(`  curated edges applied ${applied}, skipped ${skipped}\n`);
  } catch (err) {
    process.stderr.write(`  curated edges not loaded: ${err.message}\n`);
  }

  await mkdir(DIR, { recursive: true });
  const out = {
    attribution: ATTRIBUTION,
    license: "CC BY-SA 4.0",
    source:
      "https://github.com/ubsicap/ubs-open-license/tree/main/dictionaries/greek",
    merge:
      "PRIMARY UBS ES by Strong's; per-sense rv (SIL BBBCCCVVV), code, dom/sub; SECONDARY spa.tsv (lexicon|ubs-dict only, no llm); sg short / gap fill; byGloss enriched (singular/plural + multi-word tokens) + curated spanish-gloss-edges.json (key-only).",
    by,
    byGloss,
  };
  const path = join(DIR, "spanish.json");
  await writeFile(path, JSON.stringify(out));
  const bytes = Buffer.byteLength(JSON.stringify(out));
  process.stderr.write(
    `Wrote ${path} (${Object.keys(by).length} strongs, ${Object.keys(byGloss).length} gloss keys, ${Math.round(bytes / 1024)} KB)\n`,
  );
  const sample = by.G3056;
  process.stderr.write(`  sample G3056 glosses: ${JSON.stringify(sample?.ss?.[0]?.g)}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
