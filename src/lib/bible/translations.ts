import type { Locale } from "./books.ts";
import { ESV_NAME, ESV_NOTE } from "./esv.ts";

export type EnTranslationId = "esv" | "kjv" | "asv" | "web";
export type EsTranslationId = "rv1909";
export type TranslationId = EnTranslationId | EsTranslationId;

export interface TranslationInfo {
  id: TranslationId;
  /** Short label for the picker. */
  short: string;
  /** Full name; also the Chapter.translationName we expect back. */
  name: string;
  /** Attribution line shown on the chapter card. */
  note: string;
  locale: Locale;
  /** bolls.life slug when the text comes from the bolls pipe. */
  bollsSlug?: string;
}

export const EN_TRANSLATIONS: TranslationInfo[] = [
  { id: "esv", short: "ESV", name: ESV_NAME, note: ESV_NOTE, locale: "en" },
  {
    id: "kjv",
    short: "KJV",
    name: "King James Version",
    note: "King James Version. Public domain.",
    locale: "en",
    bollsSlug: "KJV",
  },
  {
    id: "asv",
    short: "ASV",
    name: "American Standard Version",
    note: "American Standard Version (1901). Public domain.",
    locale: "en",
    bollsSlug: "ASV",
  },
  {
    id: "web",
    short: "WEB",
    name: "World English Bible",
    note: "World English Bible. Public domain.",
    locale: "en",
  },
];

export const ES_TRANSLATIONS: TranslationInfo[] = [
  {
    id: "rv1909",
    short: "RV1909",
    name: "Reina Valera 1909",
    note: "Reina Valera 1909. Public domain.",
    locale: "es",
  },
];

export const DEFAULT_EN_TRANSLATION: EnTranslationId = "esv";
export const DEFAULT_ES_TRANSLATION: EsTranslationId = "rv1909";

export function translationsFor(locale: Locale): TranslationInfo[] {
  return locale === "es" ? ES_TRANSLATIONS : EN_TRANSLATIONS;
}

export function translationInfo(
  locale: Locale,
  id: string | undefined,
): TranslationInfo {
  const list = translationsFor(locale);
  const fallbackId =
    locale === "es" ? DEFAULT_ES_TRANSLATION : DEFAULT_EN_TRANSLATION;
  return list.find((t) => t.id === id) ?? list.find((t) => t.id === fallbackId) ?? list[0];
}

export function isEnTranslationId(id: string): id is EnTranslationId {
  return EN_TRANSLATIONS.some((t) => t.id === id);
}

export function isEsTranslationId(id: string): id is EsTranslationId {
  return ES_TRANSLATIONS.some((t) => t.id === id);
}
