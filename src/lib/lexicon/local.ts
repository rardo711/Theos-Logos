import type { LexiconResult } from "../bible/types.ts";

const CAUTION =
  "Approximate student note only. Confirm the lemma and senses in BDAG, BDB, or HALOT before citing.";

type Note = Omit<LexiconResult, "word">;

const GREEK: Record<string, Note> = {
  word: {
    lemma: "λόγος",
    language: "greek",
    strongs: "G3056",
    source: "AS",
    gloss:
      "Speech, reason, or message. In John 1 the Word is the eternal self-expression of God, through whom all things were made.",
    range: "word, account, reason, message; Johannine prologue: the personal Word.",
    citation: "Sense-range after LSJ / BDAG. Not a quotation of either lexicon.",
    caution: CAUTION,
  },
  beginning: {
    lemma: "ἀρχή",
    language: "greek",
    strongs: "G746",
    source: "AS",
    gloss:
      "Origin, first principle, or the start of a sequence. John opens before Genesis: the Word already was.",
    range: "beginning, origin, ruler, first principle.",
    citation: "Sense-range after LSJ / BDAG. Not a quotation.",
    caution: CAUTION,
  },
  god: {
    lemma: "θεός",
    language: "greek",
    strongs: "G2316",
    source: "AS",
    gloss:
      "God. In John 1:1 the clause ‘the Word was God’ ascribes deity to the Word without collapsing the persons.",
    range: "God, a god; in biblical usage, the true God unless context marks otherwise.",
    citation: "Sense-range after BDAG. Not a quotation.",
    caution: CAUTION,
  },
  light: {
    lemma: "φῶς",
    language: "greek",
    strongs: "G5457",
    source: "AS",
    gloss:
      "Light, illumination. In John, the life of the Word as revealing and life-giving, opposed to darkness.",
    range: "light, firelight, that which illuminates.",
    citation: "Sense-range after LSJ / BDAG. Not a quotation.",
    caution: CAUTION,
  },
  darkness: {
    lemma: "σκοτία",
    language: "greek",
    strongs: "G4653",
    source: "AS",
    gloss: "Darkness, the realm that does not comprehend or overcome the light.",
    range: "darkness, gloom; morally, the sphere opposed to God.",
    citation: "Sense-range after BDAG. Not a quotation.",
    caution: CAUTION,
  },
  life: {
    lemma: "ζωή",
    language: "greek",
    strongs: "G2222",
    source: "AS",
    gloss:
      "Life. In John, not mere animation but the life that is in the Word and given to those who believe.",
    range: "life, existence, eternal life in Johannine usage.",
    citation: "Sense-range after BDAG. Not a quotation.",
    caution: CAUTION,
  },
  flesh: {
    lemma: "σάρξ",
    language: "greek",
    strongs: "G4561",
    source: "AS",
    gloss:
      "Flesh, human nature. ‘The Word became flesh’ asserts a true incarnation, not an appearance.",
    range: "flesh, body, human nature, sometimes frail humanity.",
    citation: "Sense-range after BDAG. Not a quotation.",
    caution: CAUTION,
  },
  glory: {
    lemma: "δόξα",
    language: "greek",
    strongs: "G1391",
    source: "AS",
    gloss: "Glory, honor, the manifested splendor of God, seen in the incarnate Son.",
    range: "opinion, reputation, honor, glory, brightness.",
    citation: "Sense-range after LSJ / BDAG. Not a quotation.",
    caution: CAUTION,
  },
  grace: {
    lemma: "χάρις",
    language: "greek",
    strongs: "G5485",
    source: "AS",
    gloss: "Grace, favor, gift. In John 1, grace and truth realized through Jesus Christ.",
    range: "favor, gift, gratitude, grace.",
    citation: "Sense-range after BDAG. Not a quotation.",
    caution: CAUTION,
  },
  truth: {
    lemma: "ἀλήθεια",
    language: "greek",
    strongs: "G225",
    source: "AS",
    gloss: "Truth, reality as disclosed. Paired with grace in John 1:14, 17.",
    range: "truth, truthfulness, reality.",
    citation: "Sense-range after BDAG. Not a quotation.",
    caution: CAUTION,
  },
  world: {
    lemma: "κόσμος",
    language: "greek",
    strongs: "G2889",
    source: "AS",
    gloss:
      "The ordered world, and in John often the human world that does not know its Maker.",
    range: "order, universe, world, humankind.",
    citation: "Sense-range after BDAG. Not a quotation.",
    caution: CAUTION,
  },
  lamb: {
    lemma: "ἀμνός",
    language: "greek",
    strongs: "G286",
    source: "AS",
    gloss:
      "Lamb. In John 1:29, the Lamb of God who takes away the sin of the world — paschal and sacrificial overtones.",
    range: "lamb; in this verse, the designated sin-bearing offering.",
    citation: "Sense-range after BDAG. Not a quotation.",
    caution: CAUTION,
  },
  condemnation: {
    lemma: "κατάκριμα",
    language: "greek",
    gloss:
      "Condemnation, the penal sentence. Romans 8:1 announces that this sentence is not in force for those in Christ Jesus.",
    range: "condemnation, adverse judgment, penalty.",
    citation: "Sense-range after BDAG. Not a quotation.",
    caution: CAUTION,
  },
};

const HEBREW: Record<string, Note> = {
  beginning: {
    lemma: "רֵאשִׁית",
    language: "hebrew",
    strongs: "H7225",
    source: "BDB",
    gloss:
      "Beginning, first part. Genesis 1:1 marks the origin of the created order, not of God.",
    range: "beginning, first, chief.",
    citation: "Sense-range after BDB / HALOT. Not a quotation.",
    caution: CAUTION,
  },
  created: {
    lemma: "בָּרָא",
    language: "hebrew",
    source: "BDB",
    gloss:
      "To create. In Genesis 1:1, used of God’s bringing the heavens and the earth into being.",
    range: "create, shape; in the OT, typically with God as subject.",
    citation: "Sense-range after BDB / HALOT. Not a quotation.",
    caution: CAUTION,
  },
  god: {
    lemma: "אֱלֹהִים",
    language: "hebrew",
    strongs: "H430",
    source: "BDB",
    gloss: "God. The ordinary OT name for the true God in Genesis 1.",
    range: "God, gods, heavenly beings; here, the Creator.",
    citation: "Sense-range after BDB / HALOT. Not a quotation.",
    caution: CAUTION,
  },
  heavens: {
    lemma: "שָׁמַיִם",
    language: "hebrew",
    source: "BDB",
    gloss: "Heavens, sky. Paired with earth as a merism for the whole created order.",
    range: "heaven, sky, the heavens.",
    citation: "Sense-range after BDB. Not a quotation.",
    caution: CAUTION,
  },
  earth: {
    lemma: "אֶרֶץ",
    language: "hebrew",
    source: "BDB",
    gloss: "Earth, land. In Genesis 1:1, the lower half of ‘heavens and earth.’",
    range: "earth, land, ground, country.",
    citation: "Sense-range after BDB. Not a quotation.",
    caution: CAUTION,
  },
  lamp: {
    lemma: "נֵר",
    language: "hebrew",
    source: "BDB",
    gloss: "Lamp. In Psalm 119:105, the word as a lamp to the feet — near light for the next step.",
    range: "lamp, light.",
    citation: "Sense-range after BDB. Not a quotation.",
    caution: CAUTION,
  },
  light: {
    lemma: "אוֹר",
    language: "hebrew",
    source: "BDB",
    gloss: "Light. In Psalm 119:105, the word as light to the path — farther illumination than the lamp.",
    range: "light, daylight, illumination.",
    citation: "Sense-range after BDB. Not a quotation.",
    caution: CAUTION,
  },
};

function keyOf(word: string): string {
  return word.toLowerCase().replace(/[^a-z-]/g, "");
}

export function getLocalLexicon(
  word: string,
  reference?: string,
): LexiconResult | null {
  const key = keyOf(word);
  const ot = reference && /^(Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Proverbs|Ecclesiastes|Song|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi)/i.test(
    reference,
  );
  const note = (ot ? HEBREW[key] : undefined) ?? GREEK[key] ?? HEBREW[key];
  if (!note) return null;
  return { word, ...note };
}
