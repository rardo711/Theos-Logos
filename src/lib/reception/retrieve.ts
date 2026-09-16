export type { FetchedExtract } from "./retrieve-html.ts";
export {
  sanitizeHtml,
  htmlToText,
  isBoilerplate,
  isEmbeddedScripture,
  isMostlyVerseRefs,
  truncateAtSentence,
  isSubstantiveQuote,
  paragraphsFromHtml,
  pickParagraphs,
  pickVerseParagraphs,
  paragraphMentionsVerse,
  paragraphTreatsVerse,
  paragraphOpensWithVerseLemma,
  paragraphIsGillLemmaNote,
} from "./retrieve-html.ts";
export { fetchEntry, retrieveExtracts, byteCapFor } from "./retrieve-net.ts";
export {
  validateReceptionOutput,
  extractsPrompt,
  parseRetrieved,
  RETRIEVAL_CAUTION,
  assembleFromSources,
  ensureReservedCards,
  verseTrueLocus,
} from "./retrieve-assemble.ts";