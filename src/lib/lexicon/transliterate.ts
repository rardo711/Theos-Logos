/**
 * SBL-style transliteration for lexicon headers.
 *
 * Gives every lexicon card a Latin-script reading of its lemma —
 * `transliterateLemma("בָּרָא")` → "bārāʾ", `transliterateLemma("λόγιος")` → "logios".
 *
 * Schemes follow the SBL Handbook of Style (2nd ed.) general-purpose academic
 * transliteration: macrons for long vowels (ē ō), ḇ ḡ ḏ ḵ p̄ ṯ for the
 * begadkefat fricatives, ʾ/ʿ for alef/ayin, š ṣ ṭ ḥ q for the emphatics.
 * Shewa follows the standard vocal/silent rules (word-initial, after a long
 * vowel, or second of two shewas → vocal ĕ; word-final or after a short
 * vowel → silent). This is a display aid for headers, not a linguistic
 * claim about pronunciation.
 */

/** Detect script and transliterate; "" for anything else. */
export function transliterateLemma(lemma: string): string {
  if (!lemma) return "";
  if (/[֐-׿]/.test(lemma)) return transliterateHebrew(lemma);
  if (/[Ͱ-Ͽἀ-῾]/.test(lemma)) return transliterateGreek(lemma);
  return "";
}

// ---------------------------------------------------------------------------
// Greek (Koine, polytonic)
// ---------------------------------------------------------------------------

const GREEK_BASE: Record<string, string> = {
  "α": "a", "β": "b", "γ": "g", "δ": "d", "ε": "e", "ζ": "z",
  "η": "ē", "θ": "th", "ι": "i", "κ": "k", "λ": "l", "μ": "m",
  "ν": "n", "ξ": "x", "ο": "o", "π": "p", "ρ": "r", "σ": "s",
  "ς": "s", "τ": "t", "υ": "u", "φ": "ph", "χ": "ch", "ψ": "ps",
  "ω": "ō",
};

const GREEK_DIPHTHONGS: Record<string, string> = {
  "αι": "ai", "αυ": "au", "ει": "ei", "ευ": "eu", "ηυ": "ēu",
  "οι": "oi", "ου": "ou", "υι": "ui", "ωυ": "ōu",
};

const C_ROUGH = "̔"; // U+0314
const C_DIAERESIS = "̈"; // U+0308
const C_IOTA_SUB = "ͅ"; // U+0345
const GREEK_VOWELS = new Set(["α", "ε", "η", "ι", "ο", "υ", "ω"]);

type GreekCluster = { base: string; rough: boolean; diaeresis: boolean; iotaSub: boolean };

function parseGreek(word: string): GreekCluster[] {
  const clusters: GreekCluster[] = [];
  for (const ch of word.normalize("NFD").toLowerCase()) {
    if (ch === C_ROUGH || ch === C_DIAERESIS || ch === C_IOTA_SUB || ch === "̓") {
      const cur = clusters[clusters.length - 1];
      if (!cur) continue;
      if (ch === C_ROUGH) cur.rough = true;
      else if (ch === C_DIAERESIS) cur.diaeresis = true;
      else if (ch === C_IOTA_SUB) cur.iotaSub = true;
      continue;
    }
    if (/[̀-ͯ]/.test(ch)) continue; // accents, length marks: stripped
    if (GREEK_BASE[ch] === undefined) continue;
    clusters.push({ base: ch, rough: false, diaeresis: false, iotaSub: false });
  }
  return clusters;
}

export function transliterateGreek(lemma: string): string {
  const clusters = parseGreek(lemma);
  let out = "";
  for (let i = 0; i < clusters.length; i++) {
    const c = clusters[i];
    const next = clusters[i + 1];
    // Diphthong: vowel + ι/υ with no diaeresis breaking it.
    if (next && !c.diaeresis && !next.diaeresis && (next.base === "ι" || next.base === "υ")) {
      const pair = GREEK_DIPHTHONGS[c.base + next.base];
      if (pair) {
        out += (i === 0 && c.rough ? "h" : "") + pair;
        i++;
        continue;
      }
    }
    let t: string;
    if (c.base === "γ" && next && "γκχξ".includes(next.base)) {
      t = "n"; // gamma nasalizes before γ κ χ ξ
    } else if (c.rough && i === 0 && c.base === "ρ") {
      t = "rh";
    } else if (c.rough && i === 0 && GREEK_VOWELS.has(c.base)) {
      t = "h" + GREEK_BASE[c.base];
    } else {
      t = GREEK_BASE[c.base];
    }
    if (c.iotaSub) t += "i";
    out += t;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Hebrew (and Biblical Aramaic), pointed text
// ---------------------------------------------------------------------------

const HEBREW_CONSONANTS: Record<string, string> = {
  "א": "ʾ", "ב": "ḇ", "ג": "ḡ", "ד": "ḏ", "ה": "h", "ו": "w",
  "ז": "z", "ח": "ḥ", "ט": "ṭ", "י": "y", "כ": "ḵ", "ך": "ḵ",
  "ל": "l", "מ": "m", "ם": "m", "נ": "n", "ן": "n", "ס": "s",
  "ע": "ʿ", "פ": "p̄", "ף": "p̄", "צ": "ṣ", "ץ": "ṣ", "ק": "q",
  "ר": "r", "ש": "š", "ת": "ṯ",
};

/** Hard (dagesh lene) values for the begadkefat letters. */
const BEGADKEFAT_HARD: Record<string, string> = {
  "ב": "b", "ג": "g", "ד": "d", "כ": "k", "פ": "p", "ת": "t",
};

/** Vowel points → [transliteration, long?] */
const HEBREW_VOWELS: Record<string, [string, boolean]> = {
  "ַ": ["a", false], // patah
  "ָ": ["ā", true], // qamats
  "ֵ": ["ē", true], // ṣere
  "ֶ": ["e", false], // segol
  "ִ": ["i", false], // hireq
  "ֹ": ["ō", true], // holem
  "ֻ": ["u", false], // qibbuts
  "ֲ": ["ă", false], // hatef patah
  "ֳ": ["ŏ", false], // hatef qamats
  "ֱ": ["ĕ", false], // hatef segol
};

const SHEWA = "ְ";
const DAGESH = "ּ";
const SHIN_DOT = "ׁ";
const SIN_DOT = "ׂ";
// Cantillation (U+0591–05AF), meteg, rafe: stripped.
const STRIP_MARKS = /[֑-֯]/;

type HebrewCluster = {
  cons: string;
  dagesh: boolean;
  shin: boolean;
  sin: boolean;
  vowel: string | null; // a vowel point, SHEWA, or null
};

function parseHebrew(word: string): HebrewCluster[] {
  const clusters: HebrewCluster[] = [];
  for (const ch of word) {
    if (HEBREW_CONSONANTS[ch] !== undefined) {
      clusters.push({ cons: ch, dagesh: false, shin: false, sin: false, vowel: null });
      continue;
    }
    const cur = clusters[clusters.length - 1];
    if (!cur) continue;
    if (ch === DAGESH) cur.dagesh = true;
    else if (ch === SHIN_DOT) cur.shin = true;
    else if (ch === SIN_DOT) cur.sin = true;
    else if (ch === SHEWA || HEBREW_VOWELS[ch] !== undefined) cur.vowel = ch;
    // Cantillation, meteg, rafe, sof pasuq, maqqef: ignored for headers.
  }
  return clusters;
}

export function transliterateHebrew(lemma: string): string {
  const clusters = parseHebrew(lemma);
  const parts: string[] = [];
  // State for the shewa and dagesh-lene rules.
  let prevVowelLong = false;
  let prevSounded = false; // previous cluster carried a sounded vowel
  let prevSilentShewa = false;
  let prevVowel = "";

  const setState = (vowel: string, long: boolean, sounded: boolean) => {
    prevVowel = vowel;
    prevVowelLong = long;
    prevSounded = sounded;
    prevSilentShewa = false;
  };

  for (let i = 0; i < clusters.length; i++) {
    const c = clusters[i];
    const isFirst = i === 0;
    const isLast = i === clusters.length - 1;
    // Sounded state of the PREVIOUS cluster (for the dagesh lene/forte rule).
    // Captured before setState() overwrites it below.
    const soundedBefore = prevSounded;

    // Shureq (וּ) and holem-waw (וֹ): the waw is the vowel.
    if (c.cons === "ו" && c.dagesh && c.vowel === null) {
      parts.push("û");
      setState("û", true, true);
      continue;
    }
    if (c.cons === "ו" && (c.vowel === "ֹ" || c.vowel === "ֺ")) {
      parts.push("ô");
      setState("ô", true, true);
      continue;
    }
    // Vowelless waw after a holem is a mater (already rendered as ô).
    if (c.cons === "ו" && c.vowel === null && (prevVowel === "ō" || prevVowel === "ô")) {
      setState(prevVowel, true, true);
      continue;
    }
    // Hireq-yod / ṣere-yod / segol-yod matres lengthen the previous vowel.
    if (c.cons === "י" && c.vowel === null && ["i", "ē", "e"].includes(prevVowel)) {
      const last = parts.length - 1;
      if (last >= 0) {
        parts[last] = parts[last].replace(/i$/, "î").replace(/ē$/, "ê").replace(/e$/, "ê");
        setState(parts[last].slice(-1), true, true);
      }
      continue;
    }
    // Final silent he lengthens a preceding qamats/segol (תּוֹרָה → tôrâ).
    if (c.cons === "ה" && !c.dagesh && c.vowel === null && isLast) {
      const last = parts.length - 1;
      if (last >= 0) parts[last] = parts[last].replace(/ā$/, "â").replace(/e$/, "ê");
      setState("", false, false);
      continue;
    }

    // --- vowel ---
    let vowelPart = "";
    if (c.vowel === SHEWA) {
      // Vocal: word-initial, second of two shewas, or after a long vowel.
      // Word-final shewa is always silent.
      if (!isLast && (isFirst || prevSilentShewa || prevVowelLong)) {
        vowelPart = "ĕ";
        setState("ĕ", false, true);
      } else {
        prevSilentShewa = true;
        prevVowelLong = false;
        prevSounded = false;
        prevVowel = "";
      }
    } else if (c.vowel !== null) {
      const [v, long] = HEBREW_VOWELS[c.vowel] ?? ["", false];
      vowelPart = v;
      setState(v, long, true);
    } else {
      prevSilentShewa = false;
      prevVowelLong = false;
      prevSounded = false;
      prevVowel = "";
    }

    // --- consonant ---
    let consPart: string;
    if (c.cons === "ש") {
      const base = c.sin ? "ś" : "š";
      consPart = c.dagesh ? base + base : base;
    } else if (c.cons === "ה" && c.dagesh) {
      consPart = "h"; // mappiq
    } else if (c.dagesh && BEGADKEFAT_HARD[c.cons] !== undefined) {
      const hard = BEGADKEFAT_HARD[c.cons];
      // Dagesh lene (word-initial or after a vowelless cluster) vs forte.
      consPart = isFirst || !soundedBefore ? hard : hard + hard;
    } else if (c.dagesh) {
      const base = HEBREW_CONSONANTS[c.cons];
      consPart = base + base; // dagesh forte doubles
    } else {
      consPart = HEBREW_CONSONANTS[c.cons];
    }

    // Furtive patah: pronounced before a word-final ח/ע (רוּחַ → rûaḥ).
    if (c.vowel === "ַ" && (c.cons === "ח" || c.cons === "ע") && isLast) {
      parts.push("a" + consPart);
    } else {
      parts.push(consPart + vowelPart);
    }
  }

  return parts.join("");
}
