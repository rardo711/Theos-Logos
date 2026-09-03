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
  | "puritan";

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

export interface ReceptionResult {
  cards: SourceCard[];
  caution?: string;
  source: "curated" | "generated";
  synthesis?: DeskSynthesis;
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
