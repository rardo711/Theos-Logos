#!/usr/bin/env node
/**
 * Build compact English NT lexicon from UBS Greek NT Dictionary (en)
 * + filtered bcv-commons/strongs eng.tsv secondary short glosses.
 *
 * Run locally / on the box — DO NOT download at Vercel build.
 * Outputs: src/lib/lexicon/data/english.json
 *
 * UBS Greek NT Dictionary (English) © United Bible Societies. CC BY-SA 4.0.
 * https://github.com/ubsicap/ubs-open-license
 *
 * Merge rules (mirror of import-ubs-es-lexicon.mjs):
 * 1. PRIMARY — UBS EN JSON keyed by Strong's (G####, unpadded).
 * 2. SECONDARY — eng.tsv rows where methods contains "lexicon" OR sources
 *    contains "ubs-dict". LLM-only rows are excluded from v1.
 * 3. eng short gloss (sg) is attached when present; used as hero gloss only
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
const RESEARCH = join(ROOT, "..", "en-lexicon-research");

const UBS_URL =
  "https://raw.githubusercontent.com/ubsicap/ubs-open-license/main/dictionaries/greek/JSON/UBSGreekNTDic-v1.1-en.JSON";
const ENG_URL =
  "https://huggingface.co/datasets/bcv-commons/strongs/resolve/main/glosses/eng.tsv";

const ATTRIBUTION =
  "UBS Greek NT Dictionary (English) © United Bible Societies. Licensed under CC BY-SA 4.0.";

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
    .replace(/[^a-z]+/g, " ")
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
      headers: { "User-Agent": "Theos-Logos EN lexicon importer (CC BY-SA attribution)" },
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
      headers: { "User-Agent": "Theos-Logos EN lexicon importer (CC BY-SA attribution)" },
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
          if ((sense.LanguageCode || "en") !== "en") continue;
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
 * Keep eng.tsv rows with lexicon method OR ubs-dict source. Drop llm-only.
 */
function parseEng(text) {
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
      const list = byGloss[key] ?? [];
      if (!list.includes(id) && list.length < 5) list.push(id);
      byGloss[key] = list;
    }
  }
  return byGloss;
}

async function main() {
  process.stderr.write("Importing UBS EN + eng.tsv…\n");
  const ubs = await loadJson("UBSGreekNTDic-v1.1-en.JSON", UBS_URL);
  if (!Array.isArray(ubs)) throw new Error("UBS JSON is not an array");
  const by = parseUbs(ubs);
  process.stderr.write(`  UBS primary entries: ${Object.keys(by).length}\n`);

  const engText = await loadText("eng_glosses.tsv", ENG_URL);
  const { short, kept, skipped } = parseEng(engText);
  process.stderr.write(`  eng.tsv kept ${kept}, llm-only skipped ${skipped}, unique ${Object.keys(short).length}\n`);

  let engFilled = 0;
  let engOnly = 0;
  for (const [id, g] of Object.entries(short)) {
    if (by[id]) {
      by[id].sg = g;
      engFilled += 1;
    } else {
      // Secondary-only gap fill (rare): short gloss as sole sense.
      by[id] = {
        s: id,
        m: "",
        ss: [{ g: [g], d: "" }],
        src: "eng",
        sg: g,
      };
      engOnly += 1;
    }
  }
  process.stderr.write(`  eng attached to UBS ${engFilled}, eng-only gaps ${engOnly}\n`);

  const byGloss = buildGlossIndex(by);
  await mkdir(DIR, { recursive: true });
  const out = {
    attribution: ATTRIBUTION,
    license: "CC BY-SA 4.0",
    source:
      "https://github.com/ubsicap/ubs-open-license/tree/main/dictionaries/greek",
    merge:
      "PRIMARY UBS EN by Strong's; per-sense rv (SIL BBBCCCVVV), code, dom/sub; SECONDARY eng.tsv (lexicon|ubs-dict only, no llm); sg short / gap fill.",
    by,
    byGloss,
  };
  const path = join(DIR, "english.json");
  await writeFile(path, JSON.stringify(out));
  const bytes = Buffer.byteLength(JSON.stringify(out));
  process.stderr.write(
    `Wrote ${path} (${Object.keys(by).length} strongs, ${Object.keys(byGloss).length} gloss keys, ${Math.round(bytes / 1024)} KB)\n`,
  );
  const sample = by.G3056;
  process.stderr.write(`  sample G3056 glosses: ${JSON.stringify(sample?.ss?.[0]?.g)}\n`);
  const g25 = by.G25;
  process.stderr.write(`  sample G25 senses: ${g25?.ss?.length}, first: ${JSON.stringify(g25?.ss?.[0]?.g)}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
