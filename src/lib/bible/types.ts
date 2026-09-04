export interface Verse {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  /** Section heading that precedes this verse, when the source provides one. */
  title?: string;
}

export interface Chapter {
  reference: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verses: Verse[];
  translationName: string;
  translationNote: string;
}

export type Tradition =
  | "patristic"
  | "reformed"
  | "lutheran"
  | "catholic"
  | "orthodox"
  | "confession"
  | "eastern-patristic"
  | "western-patristic"
  | "scholastic"
  | "puritan"
  | "arminian";

export interface SourceCard {
  voice: string;
  work: string;
  tradition: Tradition;
  quote: string;
  note?: string;
  contextBridge?: string;
  citation: string;
  paraphrased?: boolean;
  url?: string;
  source?: "curated" | "generated";
  grounded?: boolean;
}

export interface DeskSynthesis {
  question: string;
  answer: string;
  cited: string[];
}

/**
 * Orientation shown when the desk retrieved little or nothing for a verse.
 * Nothing here was fetched, so nothing here is a quotation: it names the
 * interpretive question and where to go read, and it never speaks in a
 * historical figure's voice. See orient.ts for the rules this must satisfy.
 */
export interface DeskOrientation {
  /** The interpretive question the verse has actually raised. No verdict. */
  question: string;
  /** Where traditions divide, each stated in that tradition's own categories. */
  divides: Array<{ tradition: string; position: string }>;
  /** Works to go read. Names only — no invented section numbers or URLs. */
  readNext: string[];
}

export interface ReceptionResult {
  cards: SourceCard[];
  caution?: string;
  source: "curated" | "generated";
  synthesis?: DeskSynthesis;
  orientation?: DeskOrientation;
}

export interface LexiconResult {
  word: string;
  lemma?: string;
  language?: "hebrew" | "greek" | "aramaic";
  strongs?: string;
  source?: string;
  gloss: string;
  range: string;
  citation: string;
  caution: string;
}
