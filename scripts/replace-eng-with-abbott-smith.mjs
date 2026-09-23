#!/usr/bin/env node
/**
 * Replace the secondary "eng" gloss layer on canonical NT entries (G1–G5624)
 * with public-domain Abbott-Smith (1922) glosses.
 *
 * Background: the "eng" gap-fills in english.json were derived from
 * STEPBible eng.tsv (CC BY-SA 4.0) — not public domain, violating the
 * standing "everything shipped PD" requirement. Abbott-Smith's
 * "A Manual Greek Lexicon of the New Testament" (New York: Scribner's, 1922)
 * is pre-1929 and explicitly public domain per the TEI repo README.
 * Glosses are extracted VERBATIM from the TEI — never paraphrased.
 *
 * Matching: direct Strong's key on the TEI n="head|G#|G#…" attribute, then
 * greek.json lemma bridge, then an explicit inflected-form hop table
 * (verified 2026-09-23 against the ingest audit).
 *
 * Run: node scripts/replace-eng-with-abbott-smith.mjs
 * Env: ABBOTT_SMITH_TEI=/path/to/abbott-smith.tei.xml (else downloads).
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENGLISH_JSON = join(ROOT, "src/lib/lexicon/data/english.json");
const GREEK_JSON = join(ROOT, "src/lib/lexicon/data/greek.json");
const TEI_URL =
  "https://raw.githubusercontent.com/translatable-exegetical-tools/Abbott-Smith/master/abbott-smith.tei.xml";
const TEI_CACHE = join(ROOT, ".cache", "abbott-smith.tei.xml");

/** Inflected-form Strong's -> dictionary headword (verified 2026-09-23). */
const FORM_HOPS = {
  G566: "ἀπέχω",
  G567: "ἀπέχω",
  G1647: "ἐλάχιστος",
  G2277: "εἰμί",
  G3185: "μέγας",
  G3397: "μικρός",
  G5025: "οὗτος",
  G5026: "οὗτος",
  G5120: "ὁ",
  G5126: "οὗτος",
};

/** Canonical omissions (no Abbott-Smith headword; keep eng fallback). */
const EXPECTED_OMISSIONS = new Set(
  "G348 G1970 G4566 G2467 G1527 G1536 G2534 G3362 G3363 G3364 G3569 G3603 G3801 G4055 G4191 G4208 G4706 G4708 G5024 G5104".split(
    " ",
  ),
);

const GRK = "\\u0370-\\u03FF\\u1F00-\\u1FFF";

function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}
function unpad(s) {
  const m = String(s).toUpperCase().match(/^([A-Z]+)0*(\d+)([a-z]?)$/);
  return m ? `${m[1]}${m[2]}${m[3]}` : s;
}
function stripTags(s) {
  return String(s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function glossKey(g) {
  return String(g ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z]+/g, " ")
    .trim();
}

async function loadTei() {
  const override = process.env.ABBOTT_SMITH_TEI;
  if (override && existsSync(override)) {
    process.stderr.write(`  TEI from ${override}\n`);
    return readFileSync(override, "utf-8");
  }
  if (existsSync(TEI_CACHE)) {
    process.stderr.write(`  TEI from cache\n`);
    return readFileSync(TEI_CACHE, "utf-8");
  }
  process.stderr.write(`  downloading TEI…\n`);
  const res = await fetch(TEI_URL);
  if (!res.ok) throw new Error(`TEI download failed: ${res.status}`);
  const text = await res.text();
  mkdirSync(dirname(TEI_CACHE), { recursive: true });
  writeFileSync(TEI_CACHE, text);
  return text;
}

function parseTei(xml) {
  const entries = [];
  const bySnum = new Map();
  const byHead = new Map();
  for (const m of xml.matchAll(/<entry n="([^"]+)">(.*?)<\/entry>/gs)) {
    const n = m[1];
    // Strip TEI transcriber's working notes — not Abbott-Smith content.
    const body = m[2].replace(/<note>Transcriber:.*?<\/note>/gs, "");
    const parts = n.split("|");
    const head = parts[0];
    const snums = parts
      .slice(1)
      .map(unpad)
      .filter((p) => /^[GH]\d+$/i.test(p));
    const glosses = [];
    for (const g of body.matchAll(/<gloss>(.*?)<\/gloss>/gs)) {
      const t = stripTags(g[1]);
      if (t && !glosses.includes(t)) glosses.push(t);
    }
    // Sense text: first <sense …> through last </sense>.
    let senseText = "";
    const s0 = body.search(/<sense[\s>]/);
    const s1 = body.lastIndexOf("</sense>");
    if (s0 >= 0 && s1 > s0) senseText = stripTags(body.slice(s0, s1));
    const formText = stripTags(
      (body.match(/<form>(.*?)<\/form>/s) || [])[1] || "",
    );
    const etymText = stripTags(
      (body.match(/<etym>(.*?)<\/etym>/s) || [])[1] || "",
    );
    const entry = { n, head, snums, glosses, senseText, formText, etymText, body };
    entries.push(entry);
    for (const s of snums) if (!bySnum.has(s)) bySnum.set(s, entry);
    const variants = [head];
    const orth = body.match(/<orth[^>]*>(.*?)<\/orth>/s);
    if (orth) variants.push(...stripTags(orth[1]).split(","));
    for (const v of variants) {
      const k = norm(v.trim());
      if (k && !byHead.has(k)) byHead.set(k, entry);
    }
  }
  return { entries, bySnum, byHead };
}

/** Resolve a gloss-less entry via its cross-reference (q.v. / v.s. / Rec. for). */
function resolveCrossRef(entry, bySnum, byHead) {
  const body = entry.body;
  // 1. <ref><foreign … n="G###"> or <foreign …><ref>WORD</ref></foreign> — direct target.
  const nm =
    body.match(/<ref><foreign[^>]*\sn="(G\d+)"[^>]*>([^<]*)<\/foreign><\/ref>/) ??
    body.match(/<foreign[^>]*><ref>([^<]+)<\/ref><\/foreign>/);
  if (nm) {
    const snum = nm[1].startsWith("G") ? unpad(nm[1]) : null;
    const word = snum ? nm[2] : nm[1];
    const t =
      (snum && bySnum.get(snum)) || (word && byHead.get(norm(word))) || null;
    if (t && t.glosses.length)
      return { target: t, via: `ref ${snum ?? word}` };
  }
  const text = stripTags(body);
  // 2. "to WORD, q.v." / "WORD, q.v."
  let qm = text.match(new RegExp(`([${GRK}]+),?\\s+q\\.v\\.`));
  // 3. "v.s. WORD"
  if (!qm) qm = text.match(new RegExp(`v\\.s\\.\\s+([${GRK}]+)`));
  // 4. "Rec. for WORD"
  if (!qm) qm = text.match(new RegExp(`Rec\\.\\s+for\\s+([${GRK}]+)`));
  if (qm) {
    const t = byHead.get(norm(qm[1]));
    if (t && t.glosses.length) return { target: t, via: `q.v./v.s. ${qm[1]}` };
  }
  return null;
}

function senseDefinition(entry, heroGloss) {
  let d = entry.senseText || "";
  // Avoid repeating the hero gloss at the start of the definition.
  if (heroGloss && d.toLowerCase().startsWith(heroGloss.toLowerCase())) {
    d = d.slice(heroGloss.length).replace(/^[,;:\s—–-]+/, "");
  }
  if (d.length > 600) d = d.slice(0, 600).replace(/\s+\S*$/, "");
  return d;
}

function buildGlossIndex(by) {
  const byGloss = Object.create(null);
  for (const [id, e] of Object.entries(by)) {
    const glosses = [];
    for (const sense of e.ss || []) for (const g of sense.g || []) glosses.push(g);
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
  process.stderr.write("Loading english.json + greek.json…\n");
  const enRaw = JSON.parse(readFileSync(ENGLISH_JSON, "utf-8"));
  const grRaw = JSON.parse(readFileSync(GREEK_JSON, "utf-8"));
  const by = enRaw.by;
  const grBy = grRaw.by ?? grRaw;

  const xml = await loadTei();
  process.stderr.write("Parsing TEI…\n");
  const { entries, bySnum, byHead } = parseTei(xml);
  process.stderr.write(
    `  ${entries.length} entries, ${bySnum.size} strongs keys, ${byHead.size} headwords\n`,
  );

  const engIds = Object.keys(by).filter((k) => by[k].src === "eng");
  const canonical = engIds.filter((k) => parseInt(k.slice(1), 10) <= 5624);
  process.stderr.write(`  eng total ${engIds.length}, canonical ${canonical.length}\n`);

  let replaced = 0;
  const omissions = [];
  const crossRefs = [];
  for (const id of canonical) {
    const e = by[id];
    let hit = bySnum.get(id) ?? null;
    let method = hit ? "snum" : null;
    if (!hit) {
      const lemma = String(grBy[id]?.m ?? "").replace(/\s*\(.*/, "").trim();
      hit = byHead.get(norm(lemma)) ?? null;
      method = hit ? "lemma" : null;
    }
    if (!hit && FORM_HOPS[id]) {
      hit = byHead.get(norm(FORM_HOPS[id])) ?? null;
      method = hit ? "form-hop" : null;
    }
    if (!hit) {
      omissions.push(id);
      by[id] = { ...e, src: "eng-fallback" };
      continue;
    }
    let glosses = [...hit.glosses];
    let via = null;
    if (!glosses.length) {
      const r = resolveCrossRef(hit, bySnum, byHead);
      if (r) {
        glosses = [...r.target.glosses];
        via = r.via;
        crossRefs.push(`${id} ${hit.head} -> ${r.target.head} (${r.via})`);
      } else {
        const words = (hit.senseText || hit.formText || "").split(/\s+/).slice(0, 12);
        glosses = [words.join(" ")];
        via = "sense-text-fallback";
        crossRefs.push(`${id} ${hit.head} -> TEXT FALLBACK`);
      }
    }
    const hero = glosses[0];
    by[id] = {
      ...e,
      m: e.m || hit.head,
      ss: [{ g: glosses, d: senseDefinition(hit, hero) }],
      sg: hero,
      src: "abbott-smith",
    };
    replaced += 1;
  }

  // Self-validation against the audited expectations.
  const omSet = new Set(omissions);
  const missing = [...EXPECTED_OMISSIONS].filter((x) => !omSet.has(x));
  const extra = omissions.filter((x) => !EXPECTED_OMISSIONS.has(x));
  if (missing.length || extra.length) {
    throw new Error(
      `omission set drift: missing=${missing.join(",")} extra=${extra.join(",")}`,
    );
  }
  process.stderr.write(`  replaced ${replaced}, omissions ${omissions.length}\n`);
  for (const c of crossRefs) process.stderr.write(`  xref ${c}\n`);

  enRaw.byGloss = buildGlossIndex(by);
  enRaw.merge =
    "PRIMARY UBS EN by Strong's; per-sense rv (SIL BBBCCCVVV), code, dom/sub; " +
    "CANONICAL eng gap-fills (G1-G5624) replaced 2026-09-23 with Abbott-Smith " +
    "1922 (public domain) glosses verbatim, src abbott-smith; 20 omissions kept " +
    "as eng-fallback; EXTENDED eng numbers (G5625+) unchanged.";
  writeFileSync(ENGLISH_JSON, JSON.stringify(enRaw));
  const kb = Math.round(Buffer.byteLength(JSON.stringify(enRaw)) / 1024);
  process.stderr.write(`Wrote english.json (${kb} KB)\n`);
}

main().catch((err) => {
  process.stderr.write(`FATAL: ${err.message}\n`);
  process.exit(1);
});
