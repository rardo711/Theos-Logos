import { BIBLE_BOOKS, bookName, type Locale } from "./bible/books.ts";
import type { SourceCard } from "./bible/types.ts";

const VOICE_ES: Record<string, string> = {
  Ambrose: "Ambrosio",
  "Andrew of Caesarea": "Andrés de Cesarea",
  Athanasius: "Atanasio",
  "Augsburg Confession": "Confesión de Augsburgo",
  Augustine: "Agustín",
  "Basil of Caesarea": "Basilio de Cesarea",
  "Basil the Great": "Basilio el Grande",
  Bede: "Beda",
  "Belgic Confession": "Confesión Bélgica",
  "Canons of Dort": "Cánones de Dort",
  "Chalcedonian Definition": "Definición de Calcedonia",
  "Council of Chalcedon": "Concilio de Calcedonia",
  Cyprian: "Cipriano",
  "Cyril of Alexandria": "Cirilo de Alejandría",
  "Cyril of Jerusalem": "Cirilo de Jerusalén",
  "First Council of Nicaea": "Primer Concilio de Nicea",
  "First Helvetic Confession": "Primera confesión helvética",
  "Formula of Concord": "Fórmula de Concordia",
  "Gregory of Nazianzus": "Gregorio de Nacianzo",
  "Gregory of Nyssa": "Gregorio de Nisa",
  "Heidelberg Catechism": "Catecismo de Heidelberg",
  "Ignatius of Antioch": "Ignacio de Antioquía",
  Irenaeus: "Ireneo",
  "John Calvin": "Juan Calvino",
  "John Chrysostom": "Juan Crisóstomo",
  "John Owen": "John Owen",
  "Justin Martyr": "Justino Mártir",
  "Leo the Great": "León Magno",
  "Martin Luther": "Martín Lutero",
  "Matthew Henry": "Matthew Henry",
  "Nicene Creed": "Credo niceno",
  Origen: "Orígenes",
  Tertullian: "Tertuliano",
  "Thirty-Nine Articles": "Treinta y nueve artículos",
  "Thomas Aquinas": "Tomás de Aquino",
  Victorinus: "Victorino",
  "Westminster Confession": "Confesión de Westminster",
  "Westminster Larger Catechism": "Catecismo Mayor de Westminster",
};

/** Longest phrases first. Titles of received works, not machine translation of quotes. */
const PHRASES: [string, string][] = [
  ["Commentary on a Harmony of the Evangelists", "Comentario a una armonía de los Evangelistas"],
  ["Commentary on the Whole Bible", "Comentario a toda la Biblia"],
  ["Commentary on Matthew / fragments on Mark", "Comentario a Mateo / fragmentos sobre Marcos"],
  ["Commentary on 2 Peter / on last things", "Comentario a 2 Pedro / sobre las últimas cosas"],
  ["Homilies on Hebrews / on the Word", "Homilías sobre Hebreos / sobre el Verbo"],
  ["Lectures on Galatians / on grace", "Lecciones sobre Gálatas / sobre la gracia"],
  ["Tractates on the Gospel of John", "Tratados sobre el Evangelio de Juan"],
  ["Theological Oration 3 (Or. 29)", "Oración teológica 3 (Or. 29)"],
  ["Theological Oration 5 (Or. 31)", "Oración teológica 5 (Or. 31)"],
  ["Oration 37 / Theological Orations", "Oración 37 / Oraciones teológicas"],
  ["The Death of Death in the Death of Christ", "La muerte de la muerte en la muerte de Cristo"],
  ["Thirty-Nine Articles of Religion", "Treinta y nueve artículos de religión"],
  ["Westminster Confession of Faith", "Confesión de fe de Westminster"],
  ["Westminster Larger Catechism", "Catecismo Mayor de Westminster"],
  ["Nicene-Constantinopolitan Creed", "Credo niceno-constantinopolitano"],
  ["Tome to Flavian (Letter 28)", "Tomo a Flaviano (Carta 28)"],
  ["Letter to Marcellinus on the Psalms", "Carta a Marcelino sobre los Salmos"],
  ["Orations Against the Arians", "Oraciones contra los arrianos"],
  ["Augsburg Confession, Article", "Confesión de Augsburgo, artículo"],
  ["Canons of Dort, First Head", "Cánones de Dort, primer capítulo"],
  ["Formula of Concord, Epitome", "Fórmula de Concordia, Epítome"],
  ["First Helvetic Confession", "Primera confesión helvética"],
  ["On the Predestination of the Saints", "Sobre la predestinación de los santos"],
  ["On the Gift of Perseverance", "Sobre el don de la perseverancia"],
  ["On Grace and Free Will", "Sobre la gracia y el libre albedrío"],
  ["On Nature and Grace", "Sobre la naturaleza y la gracia"],
  ["On the Spirit and the Letter", "Sobre el espíritu y la letra"],
  ["On the Bondage of the Will", "La esclavitud de la voluntad"],
  ["On the Lord’s Prayer", "Sobre el Padrenuestro"],
  ["On the Lord's Prayer", "Sobre el Padrenuestro"],
  ["On the Making of Man", "Sobre la creación del hombre"],
  ["On First Principles", "Sobre los principios"],
  ["On the Holy Spirit", "Sobre el Espíritu Santo"],
  ["On the Incarnation", "Sobre la encarnación"],
  ["On the Trinity", "Sobre la Trinidad"],
  ["Prescription Against Heretics", "Prescripción contra los herejes"],
  ["Definition of Chalcedon", "Definición de Calcedonia"],
  ["Council of Chalcedon", "Concilio de Calcedonia"],
  ["Augsburg Confession", "Confesión de Augsburgo"],
  ["Heidelberg Catechism", "Catecismo de Heidelberg"],
  ["Catena Aurea on Matthew", "Catena Aurea sobre Mateo"],
  ["Catena Aurea on John", "Catena Aurea sobre Juan"],
  ["On the Sermon on the Mount", "Sobre el sermón del monte"],
  ["Assorted Sermons", "Sermones varios"],
  ["Homilies on the First Epistle of John", "Homilías sobre la Primera epístola de Juan"],
  ["Nature and Causes of Apostasy from the Gospel", "Naturaleza y causas de la apostasía del Evangelio"],
  ["Commentary on the Apocalypse", "Comentario al Apocalipsis"],
  ["Dialogue with Trypho", "Diálogo con Trifón"],
  ["Epistle to the Ephesians", "Carta a los Efesios"],
  ["Catechetical Lecture", "Catequesis"],
  ["Hexaemeron, Homily", "Hexaemeron, homilía"],
  ["Homilies on the Beatitudes", "Homilías sobre las Bienaventuranzas"],
  ["Sermons on the New Testament", "Sermones sobre el Nuevo Testamento"],
  ["Sermon 21 on the Nativity", "Sermón 21 sobre la Natividad"],
  ["The Literal Meaning of Genesis", "El sentido literal del Génesis"],
  ["Expositions on the Psalms", "Enarraciones sobre los Salmos"],
  ["Harmony of the Gospels", "Armonía de los Evangelios"],
  ["Sermon on the Mount", "Sermón del Monte"],
  ["Lectures on Genesis", "Lecciones sobre Génesis"],
  ["Tractates on 1 John", "Tratados sobre 1 Juan"],
  ["Homilies on 1 Corinthians", "Homilías sobre 1 Corintios"],
  ["Homilies on Colossians", "Homilías sobre Colosenses"],
  ["Homilies on Philippians", "Homilías sobre Filipenses"],
  ["Homilies on Hebrews", "Homilías sobre Hebreos"],
  ["Homilies on Matthew", "Homilías sobre Mateo"],
  ["Homilies on Romans", "Homilías sobre Romanos"],
  ["Homilies on John", "Homilías sobre Juan"],
  ["Tractates on John", "Tratados sobre Juan"],
  ["Sermons on John", "Sermones sobre Juan"],
  ["Christmas sermons", "Sermones de Navidad"],
  ["Exposition of Mark", "Exposición de Marcos"],
  ["Preface to Romans", "Prefacio a Romanos"],
  ["Against the Arians", "Contra los arrianos"],
  ["Against Heresies", "Contra las herejías"],
  ["Against Praxeas", "Contra Praxeas"],
  ["Not Three Gods", "No hay tres dioses"],
  ["Nicene documents", "Documentos nicenos"],
  ["First Apology", "Primera apología"],
  ["Large Catechism", "Catecismo Mayor"],
  ["Small Catechism", "Catecismo Menor"],
  ["City of God", "La ciudad de Dios"],
  ["On Prayer", "Sobre la oración"],
  ["Summa Theologiae", "Suma Teológica"],
  ["Commentary on", "Comentario a"],
  ["Tractate", "Tratado"],
  ["Homily", "Homilía"],
  ["Chapter", "Capítulo"],
  ["Article", "Artículo"],
  ["Book", "Libro"],
  ["Letter", "Carta"],
];

const CAUTION_EN =
  "Verify quotations against the printed works. This desk is a study aid, not a teacher.";
const CAUTION_ES =
  "Verifique las citas contra las obras impresas. Este escritorio es una ayuda de estudio, no un maestro.";

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


/** Extra English book forms not identical to BIBLE_BOOKS.name. */
const EXTRA_BOOK_EN_TO_ES: [string, string][] = [
  ["Song of Songs", "Cantares"],
  ["Apocalypse", "Apocalipsis"],
  ["Psalm", "Salmo"],
];

const URL_RE = /https?:\/\/[^\s<>"')\]]+/gi;
const GREEK_RE = /[\u0370-\u03FF\u1F00-\u1FFF]+/g;
const HEBREW_RE = /[\u0590-\u05FF\uFB1D-\uFB4F]+/g;

/**
 * Localize English Bible book names inside card bodies when locale=es.
 * Protects URLs and Greek/Hebrew; longest book names first (1 John before John).
 * Does not run PHRASE title maps — safe for quote prose / NMT output.
 */
export function localizeBookNamesInBody(text: string, locale: Locale): string {
  if (locale !== "es" || !text) return text;

  const tokens: string[] = [];
  const stash = (raw: string): string => {
    const i = tokens.length;
    tokens.push(raw);
    return `\u0000P${i}\u0000`;
  };

  let out = text;
  // Protect known English voice phrases that contain book-like tokens ("John Calvin").
  const voices = Object.keys(VOICE_ES).sort((a, b) => b.length - a.length);
  for (const v of voices) {
    if (v.length < 4) continue;
    out = out.split(v).join(stash(v));
  }
  out = out.replace(URL_RE, (m) => stash(m));
  out = out.replace(GREEK_RE, (m) => stash(m));
  out = out.replace(HEBREW_RE, (m) => stash(m));

  const pairs: [string, string][] = [
    ...EXTRA_BOOK_EN_TO_ES,
    ...[...BIBLE_BOOKS]
      .map((b) => [b.name, bookName(b, "es")] as [string, string])
      .filter(([en, es]) => en !== es),
  ].sort((a, b) => b[0].length - a[0].length);

  for (const [en, es] of pairs) {
    out = out.replace(new RegExp(`\\b${escapeRe(en)}\\b`, "gi"), es);
  }

  out = out.replace(/\u0000P(\d+)\u0000/g, (_, i) => tokens[Number(i)] ?? "");
  return out;
}

export function localizeTitle(text: string, locale: Locale): string {
  if (locale !== "es" || !text) return text;
  let out = text;
  for (const [en, es] of PHRASES) {
    if (out.includes(en)) out = out.split(en).join(es);
  }
  const books = [...BIBLE_BOOKS].sort((a, b) => b.name.length - a.name.length);
  for (const book of books) {
    const es = bookName(book, "es");
    if (es === book.name) continue;
    out = out.replace(new RegExp(`\\b${escapeRe(book.name)}\\b`, "g"), es);
  }
  return out;
}

export function localizeVoice(voice: string, locale: Locale): string {
  if (locale !== "es") return voice;
  return VOICE_ES[voice] ?? localizeTitle(voice, locale);
}

export function localizeCard(card: SourceCard, locale: Locale): SourceCard {
  if (locale !== "es") return card;
  return {
    ...card,
    voice: localizeVoice(card.voice, locale),
    work: localizeTitle(card.work, locale),
    citation: localizeTitle(card.citation, locale),
    // Book names only in quote (not full title maps) so NMT still owns prose.
    quote: card.quote ? localizeBookNamesInBody(card.quote, locale) : card.quote,
    note: card.note
      ? localizeBookNamesInBody(localizeTitle(card.note, locale), locale)
      : card.note,
    contextBridge: card.contextBridge
      ? localizeBookNamesInBody(localizeTitle(card.contextBridge, locale), locale)
      : card.contextBridge,
  };
}

export function localizeCaution(caution: string | undefined, locale: Locale): string {
  if (!caution) return "";
  if (locale !== "es") return caution;
  if (caution === CAUTION_EN) return CAUTION_ES;
  return caution;
}
