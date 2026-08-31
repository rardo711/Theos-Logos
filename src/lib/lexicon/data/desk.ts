/** Compact STEPBible-derived desk index. CC BY 4.0, Tyndale House. Committed — not fetched at build. */
export type Compact = {
  s: string;
  l: "h" | "g";
  m: string;
  g: string;
  d: string;
  src: "AS" | "BDB";
};

export const deskAttribution =
  "Lexicon data from STEPBible.org by Tyndale House, Cambridge. CC BY 4.0.";

export const byStrongs: Record<string, Compact> = {
  G3056: {
    s: "G3056",
    l: "g",
    m: "λόγος",
    g: "word",
    d: "Word; that by which inward thought is expressed. In John, the personal Word.",
    src: "AS",
  },
  G746: {
    s: "G746",
    l: "g",
    m: "ἀρχή",
    g: "beginning",
    d: "Beginning, origin; first principle; also rule or authority.",
    src: "AS",
  },
  G2316: {
    s: "G2316",
    l: "g",
    m: "θεός",
    g: "God",
    d: "God; a god. In the NT almost always of the one true God.",
    src: "AS",
  },
  G5457: {
    s: "G5457",
    l: "g",
    m: "φῶς",
    g: "light",
    d: "Light (opposite darkness).",
    src: "AS",
  },
  G4653: {
    s: "G4653",
    l: "g",
    m: "σκοτία",
    g: "darkness",
    d: "Darkness; in John, the realm that does not comprehend the light.",
    src: "AS",
  },
  G2222: {
    s: "G2222",
    l: "g",
    m: "ζωή",
    g: "life",
    d: "Life; existence. In John, often the life that is in God.",
    src: "AS",
  },
  G4561: {
    s: "G4561",
    l: "g",
    m: "σάρξ",
    g: "flesh",
    d: "Flesh; the soft substance of the body; human nature.",
    src: "AS",
  },
  G1391: {
    s: "G1391",
    l: "g",
    m: "δόξα",
    g: "glory",
    d: "Opinion, reputation; in Scripture, glory, honour, splendour.",
    src: "AS",
  },
  G5485: {
    s: "G5485",
    l: "g",
    m: "χάρις",
    g: "grace",
    d: "Grace, favour, gift — unearned kindness.",
    src: "AS",
  },
  G225: {
    s: "G225",
    l: "g",
    m: "ἀλήθεια",
    g: "truth",
    d: "Truth; reality as disclosed.",
    src: "AS",
  },
  G2889: {
    s: "G2889",
    l: "g",
    m: "κόσμος",
    g: "world",
    d: "Order, ornament; then the world as created order, humankind, or the present age.",
    src: "AS",
  },
  G286: {
    s: "G286",
    l: "g",
    m: "ἀμνός",
    g: "lamb",
    d: "A lamb; in John 1, of Christ.",
    src: "AS",
  },
  G2424: {
    s: "G2424",
    l: "g",
    m: "Ἰησοῦς",
    g: "Jesus",
    d: "Jesus — the Greek form of Joshua; in the NT the personal name of the Messiah.",
    src: "AS",
  },
  G5547: {
    s: "G5547",
    l: "g",
    m: "Χριστός",
    g: "Christ",
    d: "Anointed; the Messiah, Christ.",
    src: "AS",
  },
  G2962: {
    s: "G2962",
    l: "g",
    m: "κύριος",
    g: "Lord",
    d: "Lord, master, owner; in the NT often of Christ and of God.",
    src: "AS",
  },
  H430: {
    s: "H430",
    l: "h",
    m: "אֱלֹהִים",
    g: "God",
    d: "God; gods (plural of majesty or of pagan deities).",
    src: "BDB",
  },
  H7225: {
    s: "H7225",
    l: "h",
    m: "רֵאשִׁית",
    g: "beginning",
    d: "Beginning, first, chief.",
    src: "BDB",
  },
};

/** English gloss → Strong's. κόσμος is G2889 only — never G2884 (κόρος, a measure). */
export const byGloss: Record<string, string[]> = {
  word: ["G3056"],
  beginning: ["G746", "H7225"],
  god: ["G2316", "H430"],
  light: ["G5457"],
  darkness: ["G4653"],
  life: ["G2222"],
  flesh: ["G4561"],
  glory: ["G1391"],
  grace: ["G5485"],
  truth: ["G225"],
  world: ["G2889"],
  lamb: ["G286"],
  jesus: ["G2424"],
  christ: ["G5547"],
  lord: ["G2962"],
};
