/**
 * Hebrew lexicon — Brown-Driver-Briggs (1906), public domain.
 * Committed static JSON — never fetched at build. Card taps never call Gemini.
 *
 * Sense fidelity: when a verse reference is provided, pick the BDB sense block
 * whose parsed <ref> tags include that SIL verse (BBBCCCVVV). Fallback: the
 * head block (index 0). Mirrors english.ts.
 */
import hebrewBdbJson from "./data/hebrew-bdb.json" with { type: "json" };
import { referenceToSilVerseKey } from "./spanish.ts";

export const hebrewBdbAttribution =
  (hebrewBdbJson as { attribution?: string }).attribution ??
  "Brown-Driver-Briggs Hebrew and English Lexicon (1906), public domain.";

/** One BDB sense block, verbatim wording (markup stripped at import). */
type CompactBdbSense = {
  /** Full sense text, verbatim BDB. */
  t: string;
  /** Highlighted English glosses inside the block. */
  g: string[];
  /** SIL verse keys BBBCCCVVV parsed from the block's <ref> tags. */
  rv?: string[];
};

type CompactBdb = {
  s: string;
  /** Winning source CSV row id, e.g. "BDB430" (traceability for audits). */
  row: string;
  /** Hebrew (or Aramaic) headword. */
  m: string;
  pos?: string[];
  /** Occurrence count as printed by BDB. */
  occ?: number;
  /** BDB's highlighted headword gloss, e.g. "beginning, chief". */
  hw?: string;
  lang?: "aramaic";
  ss: CompactBdbSense[];
};

const by = (hebrewBdbJson as { by: Record<string, CompactBdb> }).by ?? {};
const byGloss =
  (hebrewBdbJson as { byGloss?: Record<string, string[]> }).byGloss ?? {};

export type HebrewBdbSense = {
  /** Verbatim BDB sense text (first block is the entry head). */
  text: string;
  glosses: string[];
  refs: string[];
  /** True when this sense was selected via <ref> tags for the verse. */
  matchedByReference?: boolean;
};

export type HebrewBdbResult = {
  word: string;
  strongs: string;
  lemma: string;
  pos: string[];
  occurrences?: number;
  /** BDB's own highlighted headword gloss (may be empty). */
  headwordGloss: string;
  senses: HebrewBdbSense[];
  /** Index of the sense shown as "Sense in this verse". */
  selectedSenseIndex: number;
  /**
   * Hero "meaning": headword gloss, else the selected sense's first gloss,
   * else the lemma itself (proper names usually have no gloss).
   */
  gloss: string;
  glossExtras: string[];
  /** Selected sense's full verbatim text. */
  sense: string;
  /** How many other BDB sense blocks exist beyond the selected one. */
  relatedSenseCount: number;
  isAramaic: boolean;
  attribution: string;
  /** True when the selected sense came from a <ref> verse hit. */
  senseMatchedByReference: boolean;
};

/** Accept "H430", "h430", "H0430". */
function normalizeStrongs(raw: string): string {
  const m = String(raw ?? "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .match(/H0*(\d+)/);
  return m ? `H${m[1]}` : "";
}

function glossKey(word: string): string {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z]+/g, " ")
    .trim();
}

/**
 * Irregular English inflections BDB glosses never spell out: the verse says
 * "saw" but BDB's gloss is "see". Maps inflected form → base form.
 */
const IRREGULAR_EN: Record<string, string> = {
  saw: "see", seen: "see", sees: "see",
  said: "say", says: "say",
  came: "come", comes: "come",
  went: "go", goes: "go", gone: "go",
  took: "take", taken: "take", takes: "take",
  gave: "give", given: "give", gives: "give",
  made: "make", makes: "make",
  knew: "know", known: "know", knows: "know",
  heard: "hear", hears: "hear",
  spoke: "speak", spoken: "speak", speaks: "speak",
  stood: "stand", stands: "stand",
  sat: "sit", sits: "sit",
  rose: "rise", risen: "rise", rises: "rise",
  fell: "fall", fallen: "fall", falls: "fall",
  found: "find", finds: "find",
  told: "tell", tells: "tell",
  thought: "think", thinks: "think",
  brought: "bring", brings: "bring",
  built: "build", builds: "build",
  chose: "choose", chosen: "choose",
  drank: "drink", drunk: "drink",
  ate: "eat", eaten: "eat",
  fled: "flee", fought: "fight",
  got: "get", gotten: "get",
  had: "have", has: "have",
  hid: "hide", hidden: "hide",
  held: "hold", keeps: "keep", kept: "keep",
  lay: "lie", lain: "lie",
  led: "lead", left: "leave",
  lost: "lose", meant: "mean", met: "meet", paid: "pay",
  ran: "run",
  sang: "sing", sung: "sing",
  sent: "send",
  shook: "shake", shaken: "shake",
  showed: "show", shown: "show",
  slept: "sleep", sold: "sell",
  sought: "seek",
  stole: "steal", stolen: "steal",
  struck: "strike",
  swore: "swear", sworn: "swear",
  taught: "teach",
  tore: "tear", torn: "tear",
  threw: "throw", thrown: "throw",
  wore: "wear", worn: "wear",
  wept: "weep", won: "win",
  wrote: "write", written: "write",
  drew: "draw", drawn: "draw",
  drove: "drive", driven: "drive",
  grew: "grow", grown: "grow",
  did: "do", done: "do", does: "do",
  broke: "break", broken: "break",
  bore: "bear", born: "bear", borne: "bear",
  became: "become",
  began: "begin", begun: "begin",
  bit: "bite", bitten: "bite",
  blew: "blow", blown: "blow",
  dealt: "deal", dug: "dig", dwelt: "dwell",
  forgave: "forgive", forgiven: "forgive",
  forsook: "forsake", forsaken: "forsake",
  ground: "grind", knelt: "kneel", lit: "light",
  overcame: "overcome",
  rent: "rend", shone: "shine",
  slew: "slay", slain: "slay",
  smote: "smite", smitten: "smite",
  trod: "tread", trodden: "tread",
  woke: "wake", woken: "wake", waked: "wake",
  withdrew: "withdraw", withdrawn: "withdraw",
  wrung: "wring",
  arose: "arise", arisen: "arise",
  awoke: "awake", awoken: "awake",
  clove: "cleave", cleft: "cleave", cloven: "cleave",
  crept: "creep",
  forbore: "forbear", forborne: "forbear",
  foreknew: "foreknow", foreknown: "foreknow",
  girt: "gird",
  hung: "hang", hanged: "hang",
  laden: "lade", leapt: "leap",
  overthrew: "overthrow", overthrown: "overthrow",
  pled: "plead",
  proven: "prove",
  shore: "shear", shorn: "shear",
  smelt: "smell", sped: "speed", spilt: "spill", spoilt: "spoil",
  stank: "stink", stunk: "stink",
  strode: "stride", stridden: "stride",
  swollen: "swell",
  was: "be", were: "be", been: "be", is: "be", are: "be", am: "be",
};

/**
 * Candidate index keys for an English surface form: the literal key first,
 * then the irregular base form, then regular inflection stems. Lookup unions
 * the candidates (literal hits keep priority); the verse-anchored pick still
 * decides among them.
 */
function wordVariants(word: string): string[] {
  const key = glossKey(word);
  if (!key) return [];
  const out = [key];
  const push = (v: string) => {
    if (v && v !== key && !out.includes(v)) out.push(v);
  };
  const irr = IRREGULAR_EN[key];
  if (irr) push(irr);
  if (!key.includes(" ")) {
    if (key.endsWith("ies") && key.length > 4) {
      push(key.slice(0, -3) + "y"); // carries → carry
    } else if (key.endsWith("es") && key.length > 4) {
      const stem = key.slice(0, -2);
      push(stem); // watches → watch
      push(stem + "e"); // places → place
    } else if (key.endsWith("s") && key.length > 3 && !key.endsWith("ss")) {
      push(key.slice(0, -1)); // dreams → dream
    }
    if (!key.endsWith("s") && key.length > 3) {
      push(key + "s"); // heaven → heavens (index holds the plural form)
    }
    if (key.endsWith("ed") && key.length > 4) {
      const stem = key.slice(0, -2);
      push(stem); // walked → walk
      push(stem + "e"); // shamed → shame
      const dbl = stem.match(/^(.*?)([bcdfghjklmnpqrstvwxz])\2$/);
      if (dbl) push(dbl[1] + dbl[2]); // stopped → stop
    }
    if (key.endsWith("ing") && key.length > 5) {
      const stem = key.slice(0, -3);
      push(stem); // walking → walk
      push(stem + "e"); // making → make
      const dbl = stem.match(/^(.*?)([bcdfghjklmnpqrstvwxz])\2$/);
      if (dbl) push(dbl[1] + dbl[2]); // running → run
    }
  }
  return out;
}

function pickSenseIndex(
  senses: CompactBdbSense[],
  silKey: string | null,
): { index: number; matched: boolean } {
  if (silKey) {
    // Numbered sense blocks first: they cite the verse for one specific
    // meaning. The head block (index 0) cites verses coarsely for the whole
    // entry, so it is the fallback, not the winner, when a sense block cites
    // the verse precisely (e.g. H1254's Niphal "be created" for Gen 2:4).
    const divHit = senses.findIndex(
      (s, i) => i > 0 && (s.rv || []).includes(silKey),
    );
    if (divHit >= 0) return { index: divHit, matched: true };
    if ((senses[0]?.rv || []).includes(silKey))
      return { index: 0, matched: true };
  }
  return { index: 0, matched: false };
}

function expand(
  word: string,
  e: CompactBdb,
  reference?: string,
): HebrewBdbResult {
  const silKey = referenceToSilVerseKey(reference);
  const senses: HebrewBdbSense[] = (e.ss || []).map((s) => ({
    text: s.t || "",
    glosses: s.g || [],
    refs: s.rv || [],
  }));
  const { index: selectedSenseIndex, matched } = pickSenseIndex(
    e.ss || [],
    silKey,
  );
  if (matched) senses[selectedSenseIndex].matchedByReference = true;
  const selected = senses[selectedSenseIndex] ?? senses[0];
  const headwordGloss = e.hw || "";
  // Hero meaning: when the verse pinned a specific BDB sense, that sense's
  // own gloss leads — it is the meaning in THIS verse. Otherwise BDB's
  // headword gloss wins; then the selected sense's glosses; then the lemma.
  const gloss =
    (matched && selected?.glosses[0]) ||
    headwordGloss ||
    selected?.glosses[0] ||
    e.m ||
    "";
  const glossExtras = (selected?.glosses || []).filter((g) => g !== gloss);
  return {
    word,
    strongs: e.s,
    lemma: e.m || "",
    pos: e.pos || [],
    occurrences: e.occ,
    headwordGloss,
    senses,
    selectedSenseIndex,
    gloss,
    glossExtras,
    sense: selected?.text || "",
    relatedSenseCount: Math.max(0, senses.length - 1),
    isAramaic: e.lang === "aramaic",
    attribution: hebrewBdbAttribution,
    senseMatchedByReference: matched,
  };
}

export function lookupHebrewBdbByStrongs(
  strongs: string,
  reference?: string,
): HebrewBdbResult | null {
  const key = normalizeStrongs(strongs);
  if (!key) return null;
  const raw = by[key];
  return raw ? expand(key, raw, reference) : null;
}

export function lookupHebrewBdbByGloss(
  word: string,
  reference?: string,
): HebrewBdbResult[] {
  const key = glossKey(word);
  if (!key) return [];
  const ids = byGloss[key] ?? [];
  const out: HebrewBdbResult[] = [];
  for (const id of ids) {
    const hit = lookupHebrewBdbByStrongs(id, reference);
    if (hit) out.push({ ...hit, word });
  }
  return out;
}

/**
 * Prefer a BDB hit whose <ref> tags include this verse; else first gloss hit.
 * The surface form's inflection variants are unioned (saw → see), literal
 * hits keeping priority. Never Gemini. Hebrew (and Biblical Aramaic) only.
 */
export function lookupHebrewBdbWordNow(
  word: string,
  reference?: string,
): HebrewBdbResult | null {
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const key of wordVariants(word)) {
    for (const id of byGloss[key] ?? []) {
      if (!seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    }
  }
  const hits: HebrewBdbResult[] = [];
  for (const id of ids) {
    const hit = lookupHebrewBdbByStrongs(id, reference);
    if (hit) hits.push({ ...hit, word });
  }
  if (hits.length) {
    const refHit = hits.find((h) => h.senseMatchedByReference);
    if (refHit) return refHit;
    return hits[0];
  }
  if (/^h\s*0*\d+$/i.test(word.trim())) {
    return lookupHebrewBdbByStrongs(word, reference);
  }
  return null;
}

export function hasHebrewBdbChip(word: string): boolean {
  return lookupHebrewBdbWordNow(word) != null;
}
