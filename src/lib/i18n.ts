import type { Locale } from "./bible/books";
import type { Tradition } from "./bible/types";

const EN = {
  scriptureFirst: "Scripture first",
  appearance: "Theos Logos, appearance",
  closeAppearance: "Close appearance",
  theDesk: "The desk",
  deskHint: "Type and lamp for the scripture column.",
  scriptureSize: "Scripture size",
  smaller: "Smaller",
  larger: "Larger",
  defaultSize: "Default size",
  scripture: "Scripture",
  english: "English",
  spanish: "Español",
  lamp: "Lamp",
  day: "Day",
  night: "Night",
  auto: "Auto",
  install: "Install on this device",
  openLibrary: "Open library, {book} {chapter}",
  books: "Books",
  chapter: "Chapter {n}",
  previous: "Previous",
  next: "Next",
  esvSite: "Read at ESV.org",
  verseNotes: "Historic notes on this desk",
  redMarks:
    " Red marks note verses with historic reception on this desk.",
  loadFailed: "Could not load this chapter.",
  closeLibrary: "Close library",
  close: "Close",
  contents: "Contents",
  searchBooks: "John 1:1, Word, Ps 119…",
  clearSearch: "Clear search",
  pressReturn: "Press return for {book} {n}",
  thisBook: "This book",
  theCanon: "The canon",
  readingNow: "Reading {book} {n}",
  inThisChapter: "In this chapter",
  backToTop: "Back to top",
  verseHits: "Scripture",
  searchingText: "Searching…",
  noVerseHits: "No verses match “{q}”.",
  chapterMeta: "{n} chapters",
  chapterMetaCorpus: "{n} chapters · {corpus}",
  chapterMetaNotes: " · {count} with notes in ch. {chapter}",
  anotherBook: "Another book",
  noBook: "No book matches “{q}”.",
  notesInBook: "Desk notes in this book",
  reception: "Reception",
  historicVoices: "Historic voices",
  collapseSources: "Collapse sources",
  keepSources: "Keep sources beside scripture",
  closeReception: "Close reception",
  disclaimer:
    "A research desk, not a teacher. Scripture first. Sources must be named. Take what you find to your church.",
  understood: "Understood",
  markVerse: "Mark a verse.",
  receptionHint:
    "Reception is a stack of named cards — Fathers, Reformers, confessions — not a generated sermon.",
  notesOnChapter: "Notes on this chapter",
  markedOpen:
    "Marked verses open a stack of named sources — no search required.",
  noNotesYet:
    "This chapter has no desk notes yet. You may still inquire of the sources after marking a verse.",
  lexicon: "Lexicon",
  lexicalNote: "Lexical note",
  consulting: "Consulting the sources…",
  consultingShort: "Consulting…",
  deskNotes: "Desk notes",
  gathered: "Gathered sources",
  noNotesInquire:
    "No desk notes for this verse yet. Use Commentaries to gather named sources. Inquire then reads only those cards.",
  aim: "Aim the sources",
  aimPlaceholder: "Optional focus: eternity, incarnation…",
  inquire: "Inquire",
  commentaries: "Commentaries on this verse",
  inquireHint:
    "Inquire answers from the cards already on this desk. It does not search the web.",
  needCommentariesFirst:
    "Gather commentaries first. Inquire only reads the cards already on this desk.",
  synthesisFromDesk: "From the sources on this desk",
  synthesizing: "Reading the desk notes…",
  synthesisFailed: "The desk could not verify a grounded answer.",
  compare: "Compare",
  sources: "Sources",
  removeCard: "Remove card from desk",
  removeGenerated: "Remove generated cards",
  clearGeneratedSources: "Clear generated sources",
  clearChapterGenerated: "Clear generated notes in chapter",
  resetToDeskNotes: "Reset to desk notes",
  generatedBadge: "Generated",
  groundedBadge: "Grounded Extract",
  curatedBadge: "Curated",
  noMore: "No additional sources for that focus.",
  receptionFailed: "Reception failed.",
  paraphrased: "paraphrased",
  openSource: "Open source",
  corpusLaw: "The Law",
  corpusLawShort: "Law",
  corpusHistory: "History",
  corpusHistoryShort: "History",
  corpusWisdom: "Wisdom",
  corpusWisdomShort: "Wisdom",
  corpusProphets: "The Prophets",
  corpusProphetsShort: "Prophets",
  corpusGospels: "The Gospels",
  corpusGospelsShort: "Gospels",
  corpusActs: "Acts",
  corpusActsShort: "Acts",
  corpusPaul: "Paul",
  corpusPaulShort: "Paul",
  corpusLetters: "The Letters",
  corpusLettersShort: "Letters",
  corpusRevelation: "Revelation",
  corpusRevelationShort: "Rev",
  tradPatristic: "Patristic",
  tradEasternPatristic: "Eastern Patristic",
  tradWesternPatristic: "Western Patristic",
  tradScholastic: "Scholastic",
  tradPuritan: "Puritan",
  tradArminian: "Arminian",
  tradReformed: "Reformed",
  tradLutheran: "Lutheran",
  tradCatholic: "Catholic",
  tradOrthodox: "Orthodox",
  tradConfession: "Confession",
  cautionNoKey:
    "No fetched page matched this focus, and Inquire has no Gemini key. Desk notes still work.",
  cautionNoPage:
    "No public page in the committed index treated this as its subject. The librarian does not quote from memory.",
  cautionRetrieved:
    "Quoted from fetched public pages (New Advent, CCEL, Book of Concord). This set is not closed; a page can mis-transcribe. Verify against the Latin or printed edition before citing.",
  cautionUnverified:
    "These extracts were not checked against the verse by the librarian, so they may treat a neighbouring passage. Read them as page context, not as commentary on this verse.",
  cautionNoVerseMatch:
    "No fetched page treated this verse as its subject. The librarian will not hand you a paragraph about a different verse.",
} as const;

const ES: { [K in keyof typeof EN]: string } = {
  scriptureFirst: "La Escritura primero",
  appearance: "Theos Logos, apariencia",
  closeAppearance: "Cerrar apariencia",
  theDesk: "El escritorio",
  deskHint: "Letra y lámpara para la columna de la Escritura.",
  scriptureSize: "Tamaño de la letra",
  smaller: "Más pequeño",
  larger: "Más grande",
  defaultSize: "Tamaño normal",
  scripture: "Escritura",
  english: "English",
  spanish: "Español",
  lamp: "Lámpara",
  day: "Día",
  night: "Noche",
  auto: "Auto",
  install: "Instalar en este aparato",
  openLibrary: "Abrir biblioteca, {book} {chapter}",
  books: "Libros",
  chapter: "Capítulo {n}",
  previous: "Anterior",
  next: "Siguiente",
  esvSite: "Leer en ESV.org",
  verseNotes: "Notas históricas en este escritorio",
  redMarks:
    " Las marcas rojas señalan versículos con recepción histórica en este escritorio.",
  loadFailed: "No se pudo cargar este capítulo.",
  closeLibrary: "Cerrar biblioteca",
  close: "Cerrar",
  contents: "Contenido",
  searchBooks: "Juan 1:1, Verbo, Sal 119…",
  clearSearch: "Borrar búsqueda",
  pressReturn: "Pulse intro para {book} {n}",
  thisBook: "Este libro",
  theCanon: "El canon",
  readingNow: "Leyendo {book} {n}",
  inThisChapter: "En este capítulo",
  backToTop: "Volver arriba",
  verseHits: "Escritura",
  searchingText: "Buscando…",
  noVerseHits: "Ningún versículo coincide con “{q}”.",
  chapterMeta: "{n} capítulos",
  chapterMetaCorpus: "{n} capítulos · {corpus}",
  chapterMetaNotes: " · {count} con notas en el cap. {chapter}",
  anotherBook: "Otro libro",
  noBook: "Ningún libro coincide con “{q}”.",
  notesInBook: "Notas de escritorio en este libro",
  reception: "Recepción",
  historicVoices: "Voces históricas",
  collapseSources: "Recoger las fuentes",
  keepSources: "Dejar las fuentes junto a la Escritura",
  closeReception: "Cerrar recepción",
  disclaimer:
    "Un escritorio de investigación, no un maestro. La Escritura primero. Las fuentes deben nombrarse. Lleve lo que halle a su iglesia.",
  understood: "Entendido",
  markVerse: "Marque un versículo.",
  receptionHint:
    "La recepción es un montón de fichas nombradas — Padres, Reformadores, confesiones — no un sermón generado.",
  notesOnChapter: "Notas en este capítulo",
  markedOpen:
    "Los versículos marcados abren un montón de fuentes nombradas — no hace falta buscar.",
  noNotesYet:
    "Este capítulo aún no tiene notas. Tras marcar un versículo puede consultar las fuentes.",
  lexicon: "Léxico",
  lexicalNote: "Nota léxica",
  consulting: "Consultando las fuentes…",
  consultingShort: "Consultando…",
  deskNotes: "Notas de escritorio",
  gathered: "Fuentes reunidas",
  noNotesInquire:
    "Aún no hay notas para este versículo. Use Comentarios para reunir fuentes nombradas. Consultar después solo lee esas fichas.",
  aim: "Apuntar las fuentes",
  aimPlaceholder: "Enfoque opcional: eternidad, encarnación…",
  inquire: "Consultar",
  commentaries: "Comentarios sobre este versículo",
  inquireHint:
    "Consultar responde desde las fichas ya reunidas en este escritorio. No busca en la red.",
  needCommentariesFirst:
    "Primero reúna comentarios. Consultar solo lee las fichas que ya están en el escritorio.",
  synthesisFromDesk: "Desde las fuentes de este escritorio",
  synthesizing: "Leyendo las notas del escritorio…",
  synthesisFailed: "El escritorio no pudo verificar una respuesta fundamentada.",
  compare: "Comparar",
  sources: "Fuentes",
  removeCard: "Eliminar cita del escritorio",
  removeGenerated: "Eliminar citas generadas",
  clearGeneratedSources: "Limpiar fuentes generadas",
  clearChapterGenerated: "Borrar notas generadas del capítulo",
  resetToDeskNotes: "Restablecer notas del escritorio",
  generatedBadge: "Generada",
  groundedBadge: "Extracto fundamentado",
  curatedBadge: "Curada",
  noMore: "No hay más fuentes para ese enfoque.",
  receptionFailed: "La recepción falló.",
  paraphrased: "parafraseado",
  openSource: "Abrir fuente",
  corpusLaw: "La Ley",
  corpusLawShort: "Ley",
  corpusHistory: "Historia",
  corpusHistoryShort: "Historia",
  corpusWisdom: "Sabiduría",
  corpusWisdomShort: "Sabiduría",
  corpusProphets: "Los Profetas",
  corpusProphetsShort: "Profetas",
  corpusGospels: "Los Evangelios",
  corpusGospelsShort: "Evangelios",
  corpusActs: "Hechos",
  corpusActsShort: "Hechos",
  corpusPaul: "Pablo",
  corpusPaulShort: "Pablo",
  corpusLetters: "Las Cartas",
  corpusLettersShort: "Cartas",
  corpusRevelation: "Apocalipsis",
  corpusRevelationShort: "Apoc",
  tradPatristic: "Patrística",
  tradEasternPatristic: "Patrística Oriental",
  tradWesternPatristic: "Patrística Occidental",
  tradScholastic: "Escolástica",
  tradPuritan: "Puritana",
  tradArminian: "Arminiana",
  tradReformed: "Reformada",
  tradLutheran: "Luterana",
  tradCatholic: "Católica",
  tradOrthodox: "Ortodoxa",
  tradConfession: "Confesión",
  cautionNoKey:
    "Ninguna página coincidió con este enfoque, y Consultar no tiene clave de Gemini. Las notas de escritorio siguen disponibles.",
  cautionNoPage:
    "Ninguna página pública del índice trata esto como su tema. El bibliotecario no cita de memoria.",
  cautionRetrieved:
    "Citado de páginas públicas (New Advent, CCEL, Book of Concord). El conjunto no está cerrado; una página puede transcribir mal. Verifique contra el latín o la edición impresa antes de citar.",
  cautionUnverified:
    "El bibliotecario no verificó estos extractos contra el versículo, así que pueden tratar un pasaje vecino. Léalos como contexto de la página, no como comentario de este versículo.",
  cautionNoVerseMatch:
    "Ninguna página recuperada trata este versículo como su tema. El bibliotecario no le entregará un párrafo sobre otro versículo.",
};

export type Msg = keyof typeof EN;

export function t(
  locale: Locale,
  key: Msg,
  vars?: Record<string, string | number>,
): string {
  let s: string = (locale === "es" ? ES : EN)[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}

const CORPUS_KEY: Record<
  string,
  { name: Msg; short: Msg }
> = {
  law: { name: "corpusLaw", short: "corpusLawShort" },
  history: { name: "corpusHistory", short: "corpusHistoryShort" },
  wisdom: { name: "corpusWisdom", short: "corpusWisdomShort" },
  prophets: { name: "corpusProphets", short: "corpusProphetsShort" },
  gospels: { name: "corpusGospels", short: "corpusGospelsShort" },
  acts: { name: "corpusActs", short: "corpusActsShort" },
  paul: { name: "corpusPaul", short: "corpusPaulShort" },
  letters: { name: "corpusLetters", short: "corpusLettersShort" },
  revelation: { name: "corpusRevelation", short: "corpusRevelationShort" },
};

export function corpusLabel(
  locale: Locale,
  key: string,
  kind: "name" | "short",
): string {
  const ids = CORPUS_KEY[key];
  if (!ids) return key;
  return t(locale, ids[kind]);
}

const TRADITION_KEY: Record<Tradition, Msg> = {
  patristic: "tradPatristic",
  "eastern-patristic": "tradEasternPatristic",
  "western-patristic": "tradWesternPatristic",
  scholastic: "tradScholastic",
  puritan: "tradPuritan",
  arminian: "tradArminian",
  reformed: "tradReformed",
  lutheran: "tradLutheran",
  catholic: "tradCatholic",
  orthodox: "tradOrthodox",
  confession: "tradConfession",
};

export function traditionLabel(locale: Locale, tradition: Tradition): string {
  return t(locale, TRADITION_KEY[tradition]);
}

export function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale === "es" ? "es" : "en";
}
