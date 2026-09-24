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

/** Strong's concise-definition attribution (the Meaning hero's source). */
export const strongsAttribution =
  (hebrewBdbJson as { strongsAttribution?: string }).strongsAttribution ??
  "Strong's Hebrew Dictionary (1890), public domain.";

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
  /** This entry's own source CSV row id (traceability for audits). */
  row: string;
  /** Hebrew (or Aramaic) headword. */
  m: string;
  pos?: string[];
  /** Occurrence count as printed by BDB. */
  occ?: number;
  /** BDB's highlighted headword gloss, e.g. "beginning, chief". */
  hw?: string;
  /** Strong's concise definition, verbatim (1890, public domain). */
  sd?: string;
  lang?: "aramaic";
  ss: CompactBdbSense[];
  /** BDB's own section marker, verbatim ("I", "II", "III", …). */
  sec?: string;
  /** Canonical Strong's number this split was carved out of. */
  splitFrom?: string;
  /** 0 = primary (winner row); 1, 2, … = splits in BDB row order. */
  splitIndex?: number;
  /** Head-only, ref-less row: a brief lexeme, shown in the "related lexemes" disclosure. */
  stub?: boolean;
  /** This row may hide an unmarked homograph section: needs a human. */
  needsReview?: boolean;
  needsReviewReason?: string;
  /** Other H-numbers holding this entry's missing lexeme (tappable). */
  seeAlso?: string[];
  /** Dropped "see below/q.v." stub row ids (traceability). */
  droppedStubs?: string[];
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

export type HebrewBdbSibling = {
  /** Entry key: "H1254" (primary) or "H1254b" (split). */
  key: string;
  sec?: string;
  headwordGloss: string;
  lemma: string;
  stub: boolean;
  isPrimary: boolean;
  needsReview?: boolean;
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
   * Hero "meaning": Strong's concise definition when the entry has one
   * (the dictionary definition of the word, verbatim Strong's 1890);
   * otherwise the BDB chain — verse-pinned sense gloss, headword gloss,
   * selected sense's clearest gloss, then the lemma (proper names usually
   * have no gloss). EXCEPTION (Gerardo's call): on a SPLIT entry, a
   * verse-matched BDB sense outranks Strong's — showing Strong's "to
   * create" on the "be fat" lexeme would reproduce the bug being fixed.
   */
  gloss: string;
  /** Which source the hero gloss comes from ("bdb" on verse-routed splits). */
  glossSource: "strongs" | "bdb";
  /**
   * Strong's concise definition for this entry, verbatim ("" when Strong's
   * has no definition for the number — the hero then falls back to BDB).
   * Never mixed with BDB text: the card attributes each source separately.
   */
  strongsDefinition: string;
  glossExtras: string[];
  /** Selected sense's full verbatim text. */
  sense: string;
  /**
   * One-line "Sense in this verse" extract — always verbatim BDB text,
   * never paraphrased (see verseSenseLine). The full block stays in `sense`.
   */
  senseLine: string;
  /** How many other BDB sense blocks exist beyond the selected one. */
  relatedSenseCount: number;
  isAramaic: boolean;
  attribution: string;
  /** True when the selected sense came from a <ref> verse hit. */
  senseMatchedByReference: boolean;
  /** Entry key: "H1254" or the split key "H1254b". */
  splitKey: string;
  /** True for H####b/c/… split entries. */
  isSplit: boolean;
  /** BDB's own section marker, verbatim ("I", "II", …). */
  sec?: string;
  /** True for brief head-only lexemes (shown in the disclosure, not as cards). */
  stub: boolean;
  /** This row may hide an unmarked homograph section: needs a human. */
  needsReview: boolean;
  needsReviewReason?: string;
  /** Other H-numbers holding this entry's missing lexeme. */
  seeAlso: string[];
  /** Sibling lexemes under the same Strong's number (for the disclosure). */
  siblings: HebrewBdbSibling[];
  /** Set when a stub lookup was redirected to the primary entry. */
  redirectedFromStub?: string;
};

/** Accept "H430", "h430", "H0430" — and split keys "H1254b" (suffix kept). */
function normalizeStrongs(raw: string): string {
  const m = String(raw ?? "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .match(/H0*(\d+)([A-Z]?)/);
  return m ? `H${m[1]}${m[2].toLowerCase()}` : "";
}

/** Canonical number for a key: "H1254b" → "H1254". */
function canonicalOf(key: string): string {
  return key.replace(/[a-z]$/, "");
}

/** All entry keys under one Strong's number, primary first. */
function splitKeysOf(canonical: string): string[] {
  const out: string[] = [];
  for (const [key, e] of Object.entries(by)) {
    if ((e as CompactBdb).s === canonical) out.push(key);
  }
  out.sort(
    (a, b) =>
      ((by[a] as CompactBdb).splitIndex ?? 0) -
        ((by[b] as CompactBdb).splitIndex ?? 0) || (a < b ? -1 : 1),
  );
  return out;
}

/** Sibling lexemes for the card's "related lexemes" disclosure. */
function siblingInfos(canonical: string): HebrewBdbSibling[] {
  return splitKeysOf(canonical).map((key) => {
    const e = by[key] as CompactBdb;
    return {
      key,
      sec: e.sec,
      headwordGloss: e.hw || "",
      lemma: e.m || "",
      stub: !!e.stub,
      isPrimary: (e.splitIndex ?? 0) === 0,
      needsReview: e.needsReview,
    };
  });
}

/** Sibling entry keys for a Strong's number ("H1254" → ["H1254", "H1254b"]). */
export function listHebrewBdbSplits(strongs: string): string[] {
  const key = normalizeStrongs(strongs);
  if (!key) return [];
  const canon = canonicalOf(key);
  return by[canon] ? splitKeysOf(canon) : [];
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

/** BDB stem/paradigm labels and bare grammar labels: not meanings. */
const GLOSS_LABEL_RE =
  /^(Perfect|Imperfect|Imperative|Infinitive|Participle|Gerund|Qal|Niphal|Piel|Pual|Hiphil|Hophal|Hithpael|Hothpael|Polel|Polal|Pilpel|Poel|Poal|Hithpalpel|Tiphel)(\s|[.,:;]|$)/i;
const GRAMMAR_LABEL_RE =
  /^(plural|singular|masculine|feminine|absolute|construct|dual|common)$/i;

const isGlossLabel = (g: string) =>
  GLOSS_LABEL_RE.test(g) || GRAMMAR_LABEL_RE.test(g);
const isPlainGloss = (g: string) => !isGlossLabel(g) && !/:$/.test(g);

/**
 * The block's clearest plain-English gloss — always verbatim BDB, just
 * better-chosen:
 *  - a trailing-colon cross-reference marker restated cleanly in the same
 *    block ("sow:" -> "sow");
 *  - a bare label ("plural") replaced by the block's first plain gloss
 *    ("rulers, judges");
 *  - otherwise the first gloss untouched — later glosses in a block can be
 *    alternative parsings ("with me is God:" vs "I have wearied myself"),
 *    so they are never promoted over the block's own opening gloss.
 * Returns "" when the block has no usable meaning gloss (paradigm blocks).
 */
export function clearestBlockGloss(glosses: string[]): string {
  const list = (glosses ?? []).map((g) => g.replace(/\s+/g, " ").trim()).filter(Boolean);
  if (!list.length) return "";
  const g0 = list[0];
  if (/:$/.test(g0) && !isGlossLabel(g0)) {
    const restated = list.slice(1).find((g) => g === g0.replace(/[:\s]+$/, ""));
    if (restated) return restated;
    return g0;
  }
  if (isGlossLabel(g0)) return list.slice(1).find(isPlainGloss) ?? "";
  return g0;
}

/**
 * One-line "Sense in this verse" extract. Always verbatim BDB text — never
 * paraphrased or reworded:
 *  1. the selected block's clearest highlighted gloss (plain English over
 *     BDB cross-reference punctuation and grammar labels);
 *  2. else BDB's headword gloss — the entry's own plain-English summary;
 *  3. else the block's opening text as a verbatim prefix (whitespace
 *     collapsed, cut at a word boundary to 160 chars, "…" when truncated).
 */
export function verseSenseLine(
  text: string,
  glosses: string[],
  headwordGloss: string,
): string {
  const clean = (s: string) => s.replace(/\s+/g, " ").trim();
  const line = clearestBlockGloss(glosses);
  if (line) return line;
  const hw = clean(headwordGloss ?? "");
  if (hw) return hw;
  const t = clean(text ?? "");
  if (t.length <= 160) return t;
  const cut = t.slice(0, 160);
  const at = cut.lastIndexOf(" ");
  return (at > 80 ? cut.slice(0, at) : cut).trimEnd() + "…";
}

function expand(
  word: string,
  key: string,
  e: CompactBdb,
  reference?: string,
  redirectedFromStub?: string,
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
  const strongsDefinition = e.sd || "";
  const splitIndex = e.splitIndex ?? 0;
  const isSplit = splitIndex > 0;
  // Hero meaning: Strong's concise definition wins when present — it is the
  // dictionary definition of the word, and it is what the card attributes as
  // Strong's. Without one, the BDB chain stands: when the verse pinned a
  // specific BDB sense, that sense's own clearest gloss leads (it is the
  // meaning in THIS verse, and it beats the dictionary headword default);
  // otherwise BDB's headword gloss wins; then the selected sense's clearest
  // gloss; then the lemma.
  // EXCEPTION (Gerardo's call): on a SPLIT entry, a verse-matched BDB sense
  // outranks Strong's — the Strong's definition describes the NUMBER, and on
  // a split like H1254b ("be fat") it would read "to create".
  const senseGloss = clearestBlockGloss(selected?.glosses || []);
  const bdbHero =
    (matched && senseGloss) || headwordGloss || senseGloss || e.m || "";
  const gloss =
    isSplit && matched && senseGloss
      ? senseGloss
      : strongsDefinition || bdbHero;
  const glossSource: "strongs" | "bdb" =
    gloss === strongsDefinition && strongsDefinition ? "strongs" : "bdb";
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
    glossSource,
    strongsDefinition,
    glossExtras,
    sense: selected?.text || "",
    senseLine: verseSenseLine(
      selected?.text || "",
      selected?.glosses || [],
      headwordGloss,
    ),
    relatedSenseCount: Math.max(0, senses.length - 1),
    isAramaic: e.lang === "aramaic",
    attribution: hebrewBdbAttribution,
    senseMatchedByReference: matched,
    splitKey: key,
    isSplit,
    sec: e.sec,
    stub: !!e.stub,
    needsReview: !!e.needsReview,
    needsReviewReason: e.needsReviewReason,
    seeAlso: e.seeAlso ?? [],
    siblings: siblingInfos(e.s),
    redirectedFromStub,
  };
}

export function lookupHebrewBdbByStrongs(
  strongs: string,
  reference?: string,
): HebrewBdbResult | null {
  const key = normalizeStrongs(strongs);
  if (!key) return null;
  const direct = by[key] as CompactBdb | undefined;
  if (!direct) return null;
  // Stub lexemes live behind the primary's "related lexemes" disclosure,
  // never as their own card (Gerardo's call).
  if (direct.stub) {
    const canon = canonicalOf(key);
    const primary = by[canon] as CompactBdb | undefined;
    if (primary && canon !== key)
      return expand(key, canon, primary, reference, key);
    return expand(key, key, direct, reference);
  }
  // Canonical lookup with a verse: route primary → siblings, first
  // verse-matched sense wins (each split carries only its own row's refs).
  // A suffixed key always opens its own lexeme.
  if (canonicalOf(key) === key) {
    const silKey = referenceToSilVerseKey(reference);
    if (silKey) {
      for (const k of splitKeysOf(key)) {
        const e = by[k] as CompactBdb;
        if (e.stub) continue;
        const hit = expand(key, k, e, reference);
        if (hit.senseMatchedByReference) return hit;
      }
    }
  }
  return expand(key, key, direct, reference);
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
  if (/^h\s*0*\d+[a-z]?$/i.test(word.trim())) {
    return lookupHebrewBdbByStrongs(word, reference);
  }
  return null;
}

export function hasHebrewBdbChip(word: string): boolean {
  return lookupHebrewBdbWordNow(word) != null;
}
