import React, { createContext, useContext } from "react";
import { Book } from "./types";

export type Lang = "en" | "es";

/* Standard Reina-Valera book names, keyed by book id */
export const ES_BOOK_NAMES: Record<string, string> = {
  GEN: "Génesis", EXO: "Éxodo", LEV: "Levítico", NUM: "Números",
  DEU: "Deuteronomio", JOS: "Josué", JDG: "Jueces", RUT: "Rut",
  "1SA": "1 Samuel", "2SA": "2 Samuel", "1KI": "1 Reyes", "2KI": "2 Reyes",
  "1CH": "1 Crónicas", "2CH": "2 Crónicas", EZR: "Esdras", NEH: "Nehemías",
  EST: "Ester", JOB: "Job", PSA: "Salmos", PRO: "Proverbios",
  ECC: "Eclesiastés", SNG: "Cantares", ISA: "Isaías", JER: "Jeremías",
  LAM: "Lamentaciones", EZE: "Ezequiel", DAN: "Daniel", HOS: "Oseas",
  JOL: "Joel", AMO: "Amós", OBA: "Abdías", JON: "Jonás",
  MIC: "Miqueas", NAM: "Nahúm", HAB: "Habacuc", ZEP: "Sofonías",
  HAG: "Hageo", ZEC: "Zacarías", MAL: "Malaquías", MAT: "Mateo",
  MRK: "Marcos", LUK: "Lucas", JHN: "Juan", ACT: "Hechos",
  ROM: "Romanos", "1CO": "1 Corintios", "2CO": "2 Corintios", GAL: "Gálatas",
  EPH: "Efesios", PHP: "Filipenses", COL: "Colosenses",
  "1TH": "1 Tesalonicenses", "2TH": "2 Tesalonicenses",
  "1TI": "1 Timoteo", "2TI": "2 Timoteo", TIT: "Tito", PHM: "Filemón",
  HEB: "Hebreos", JAS: "Santiago", "1PE": "1 Pedro", "2PE": "2 Pedro",
  "1JN": "1 Juan", "2JN": "2 Juan", "3JN": "3 Juan", JUD: "Judas",
  REV: "Apocalipsis",
};

export function getBookDisplayName(book: Book, lang: Lang): string {
  return lang === "es" ? (ES_BOOK_NAMES[book.id] ?? book.name) : book.name;
}

/* UI strings. Spanish uses the formal "usted" register — scholarly but plain. */
const en = {
    scholarlyStudy: "Scholarly Study",
    nav: { bible: "Bible", research: "Research", words: "Words" },
    panelResearch: "Research",
    panelWordStudy: "Word Study",
    // Bible viewer
    chapter: "Chapter",
    findInChapter: "Find in chapter...",
    selectToBegin: "Select a book and chapter to begin.",
    failedToLoad: "Failed to Load",
    theologicalInquiry: "Theological Inquiry: Verse",
    askPlaceholder: "Ask about context, puritan views...",
    ask: "Ask",
    defineGreekHebrew: "Define in Greek/Hebrew",
    // Book nav
    oldTestament: "Old Testament",
    newTestament: "New Testament",
    searchBooks: "Search books...",
    noBooksFound: "No books found matching",
    chapterAbbrev: "CH",
    // Research panel
    researchRoom: "Research Room",
    historicalSynthesis: "Historical Synthesis",
    questionPlaceholder: "Theological question or topic...",
    synthesizeCommentary: "Synthesize Commentary",
    consultingSources: "Consulting sources...",
    verseFocus: "Verse {n} Focus",
    compiling: "Compiling historical reception…",
    streaming: "Streaming synthesis…",
    enterLibrary: "Enter the Library",
    emptyResearchBody:
      "Initiate an inquiry to retrieve historical commentary, lexical analysis, and theological synthesis.",
    inquiryError: "Inquiry Error",
    clear: "Clear",
    copy: "Copy",
    deepResearchTitle: "Deep Research:",
    deepResearchBody:
      "Highlight any text in the synthesis above to trigger a specific follow-up inquiry focused on that context.",
    eldersNote:
      "Historical scholarship provides analytical starting points. All theological inquiry should be brought before your local elders/pastors, as the Church is the primary community for the interpretation of Sacred Scripture.",
    ecclesialTitle: "Ecclesial Study",
    ecclesialBody:
      '"The local church is the pillar and buttress of the truth." These insights are research aids; the living community of faith is where theology should be refined.',
    churchResources: "Church Research Resources",
    // Follow-up modal
    followUpTitle: "Follow-up Research",
    deepContext: "Deep Context Enabled",
    referencedText: "Referenced Text:",
    synthesisLabel: "Synthesis:",
    followUpPlaceholder: "Ask your follow-up research question...",
    followUpEmpty: "Ask a question about the selected text above.",
    followUpLoading: "Consulting historical sources and secondary scholarship...",
    researchReference: "Research this reference",
    // Word study panel
    wordStudy: "Word Study",
    originalLanguageLexicon: "Original Language Lexicon",
    wordPlaceholder: "A word in English, Greek, or Hebrew…",
    anchorTo: "Anchor to current passage",
    studyWord: "Study Word",
    consultingLexicons: "Consulting lexicons…",
    parsingLanguages: "Parsing original languages and verifying sources…",
    lexiconError: "Lexicon Error",
    defineAWord: "Define a Word",
    wordEmptyBody:
      "Get the original Greek or Hebrew, Strong's number, semantic range, and cited sources for any biblical term.",
    tryLabel: "Try",
    verifySourcesTitle: "Verify your sources:",
    verifySourcesBody:
      "AI-generated lexical entries approximate the methodology of BDAG and HALOT. For formal study, confirm definitions against the published lexicons.",
    // History drawer
    studyHistory: "Study History",
    noHistory: "No study history yet. Generate commentary to save it here.",
    generalCommentary: "General Commentary",
    // Disclaimer
    disclaimerTitle: "A Research Tool, Not a Teacher",
    disclaimerBody:
      "THEOS LOGOS surfaces historical commentary and scholarship to support your Bible study. It is not a substitute for your pastor, your local church, or the community of believers.",
    methodology: "Our Methodology",
    methodologyEmphasis: "Grammatical-Historical method",
    methodologyBody1: "We prioritize the ",
    methodologyBody2:
      ", drawing from Church Fathers, Reformers, and Puritans to provide objective, scholarly insights.",
    enterLibraryBtn: "Enter Library",
    // Typography popover
    readingAppearance: "Reading Appearance",
    fontSize: "Font Size",
    typeface: "Typeface",
    theme: "Theme",
    themeNames: { auto: "Auto", light: "Light", dark: "Dark" } as Record<string, string>,
    // Header chips
    webGrounded: "Web Grounded",
    geminiActive: "Gemini AI Active",
    // Typography popover
    language: "Language",
    // Word study expand
    expandStudy: "Expand Full Scholarly Analysis",
    expandedStudy: "Full Scholarly Analysis",
    expandLoading: "Generating full analysis…",
    // Install hint
    installTitle: "Add to Home Screen",
    installIOSSteps: ["Tap the Share button (↑) in Safari", "Select \"Add to Home Screen\"", "Tap \"Add\" to confirm"],
    installAndroidSteps: ["Tap the ⋮ menu in Chrome", "Select \"Add to Home Screen\" or \"Install App\"", "Tap \"Install\" to confirm"],
    installGotIt: "Got it, don't show again",
    // Other Traditions
    otherTraditions: "Other Traditions",
    hideOtherTraditions: "Hide Other Traditions",
};

export type Strings = typeof en;

const es: Strings = {
    scholarlyStudy: "Estudio Académico",
    nav: { bible: "Biblia", research: "Investigación", words: "Léxico" },
    panelResearch: "Investigación",
    panelWordStudy: "Estudio de Palabras",
    // Bible viewer
    chapter: "Capítulo",
    findInChapter: "Buscar en el capítulo…",
    selectToBegin: "Seleccione un libro y un capítulo para comenzar.",
    failedToLoad: "Error al Cargar",
    theologicalInquiry: "Consulta Teológica: Versículo",
    askPlaceholder: "Pregunte sobre el contexto, las perspectivas puritanas…",
    ask: "Preguntar",
    defineGreekHebrew: "Definir en griego/hebreo",
    // Book nav
    oldTestament: "Antiguo Testamento",
    newTestament: "Nuevo Testamento",
    searchBooks: "Buscar libros…",
    noBooksFound: "No se encontraron libros para",
    chapterAbbrev: "CAP",
    // Research panel
    researchRoom: "Sala de Investigación",
    historicalSynthesis: "Síntesis Histórica",
    questionPlaceholder: "Pregunta o tema teológico…",
    synthesizeCommentary: "Sintetizar Comentario",
    consultingSources: "Consultando las fuentes…",
    verseFocus: "Enfoque: Versículo {n}",
    compiling: "Compilando la recepción histórica…",
    streaming: "Transmitiendo la síntesis…",
    enterLibrary: "Entre en la Biblioteca",
    emptyResearchBody:
      "Inicie una consulta para obtener comentario histórico, análisis léxico y síntesis teológica.",
    inquiryError: "Error de Consulta",
    clear: "Borrar",
    copy: "Copiar",
    deepResearchTitle: "Investigación Profunda:",
    deepResearchBody:
      "Resalte cualquier texto de la síntesis anterior para iniciar una consulta de seguimiento centrada en ese contexto.",
    eldersNote:
      "La erudición histórica ofrece puntos de partida analíticos. Toda consulta teológica debe presentarse ante los ancianos y pastores de su iglesia local, pues la Iglesia es la comunidad primaria para la interpretación de la Sagrada Escritura.",
    ecclesialTitle: "Estudio Eclesial",
    ecclesialBody:
      "«La iglesia local es columna y baluarte de la verdad». Estas reflexiones son auxiliares de investigación; la comunidad viva de la fe es donde la teología debe perfeccionarse.",
    churchResources: "Recursos para Encontrar Iglesia",
    // Follow-up modal
    followUpTitle: "Investigación de Seguimiento",
    deepContext: "Contexto Profundo Activado",
    referencedText: "Texto Citado:",
    synthesisLabel: "Síntesis:",
    followUpPlaceholder: "Escriba su pregunta de seguimiento…",
    followUpEmpty: "Haga una pregunta sobre el texto seleccionado.",
    followUpLoading: "Consultando fuentes históricas y bibliografía secundaria…",
    researchReference: "Investigar esta referencia",
    // Word study panel
    wordStudy: "Estudio de Palabras",
    originalLanguageLexicon: "Léxico de Lenguas Originales",
    wordPlaceholder: "Una palabra en español, griego o hebreo…",
    anchorTo: "Anclar al pasaje actual",
    studyWord: "Estudiar Palabra",
    consultingLexicons: "Consultando los léxicos…",
    parsingLanguages: "Analizando las lenguas originales y verificando las fuentes…",
    lexiconError: "Error del Léxico",
    defineAWord: "Defina una Palabra",
    wordEmptyBody:
      "Obtenga el griego o hebreo original, el número de Strong, el rango semántico y fuentes citadas para cualquier término bíblico.",
    tryLabel: "Pruebe",
    verifySourcesTitle: "Verifique sus fuentes:",
    verifySourcesBody:
      "Las entradas léxicas generadas por IA aproximan la metodología de BDAG y HALOT. Para un estudio formal, confirme las definiciones en los léxicos publicados.",
    // History drawer
    studyHistory: "Historial de Estudio",
    noHistory: "Aún no hay historial de estudio. Genere un comentario para guardarlo aquí.",
    generalCommentary: "Comentario General",
    // Disclaimer
    disclaimerTitle: "Una Herramienta de Investigación, No un Maestro",
    disclaimerBody:
      "THEOS LOGOS presenta comentario histórico y erudición para apoyar su estudio de la Biblia. No sustituye a su pastor, a su iglesia local ni a la comunidad de creyentes.",
    methodology: "Nuestra Metodología",
    methodologyEmphasis: "método gramático-histórico",
    methodologyBody1: "Priorizamos el ",
    methodologyBody2:
      ", recurriendo a los Padres de la Iglesia, los Reformadores y los Puritanos para ofrecer perspectivas objetivas y académicas.",
    enterLibraryBtn: "Entrar en la Biblioteca",
    // Typography popover
    readingAppearance: "Apariencia de Lectura",
    fontSize: "Tamaño de Letra",
    typeface: "Tipografía",
    theme: "Tema",
    themeNames: { auto: "Auto", light: "Claro", dark: "Oscuro" } as Record<string, string>,
    // Header chips
    webGrounded: "Verificado en la Web",
    geminiActive: "Gemini Activo",
    // Typography popover
    language: "Idioma",
    // Word study expand
    expandStudy: "Expandir Análisis Académico Completo",
    expandedStudy: "Análisis Académico Completo",
    expandLoading: "Generando análisis completo…",
    // Install hint
    installTitle: "Agregar a Pantalla de Inicio",
    installIOSSteps: ["Toque el botón Compartir (↑) en Safari", "Seleccione \"Agregar a pantalla de inicio\"", "Toque \"Agregar\" para confirmar"],
    installAndroidSteps: ["Toque el menú ⋮ en Chrome", "Seleccione \"Agregar a pantalla de inicio\" o \"Instalar aplicación\"", "Toque \"Instalar\" para confirmar"],
    installGotIt: "Entendido, no mostrar de nuevo",
    // Other Traditions
    otherTraditions: "Otras Tradiciones",
    hideOtherTraditions: "Ocultar Otras Tradiciones",
};

const STRINGS: Record<Lang, Strings> = { en, es };

export function getStrings(lang: Lang): Strings {
  return STRINGS[lang];
}

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  s: Strings;
}

export const I18nContext = createContext<I18nValue>({
  lang: "en",
  setLang: () => {},
  s: STRINGS.en,
});

export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
