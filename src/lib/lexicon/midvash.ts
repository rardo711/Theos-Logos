/**
 * Midvash Strong's concordance deep links (prefer over BibleHub).
 * Numbers without leading zeros: G3956 → g3956, H7225 → h7225.
 */
import type { Locale } from "../bible/books.ts";

export type StrongsLang = "greek" | "hebrew";

export function parseStrongsId(
  strongs: string,
): { lang: StrongsLang; n: string } | null {
  const m = String(strongs ?? "")
    .toUpperCase()
    .match(/^([GH])0*(\d+)$/);
  if (!m) return null;
  return {
    lang: m[1] === "H" ? "hebrew" : "greek",
    n: m[2],
  };
}

function digitsOnly(strongs: string): string {
  const stripped = String(strongs ?? "")
    .replace(/^[GH]0*/i, "")
    .replace(/\D/g, "");
  return stripped || "0";
}

/**
 * Locale-aware Midvash Strong's URL.
 * ES: /es/concordancia-strong/{griego|hebreo}/{g|h}{n}
 * EN: /strongs-concordance/{greek|hebrew}/{g|h}{n}
 */
export function strongsMidvashHref(
  strongs: string,
  locale: Locale = "es",
): string {
  const parsed = parseStrongsId(strongs);
  const lang: StrongsLang = parsed?.lang ?? "greek";
  const n = parsed?.n ?? digitsOnly(strongs);
  const letter = lang === "hebrew" ? "h" : "g";
  if (locale === "es") {
    const pathLang = lang === "hebrew" ? "hebreo" : "griego";
    return `https://midvash.com/es/concordancia-strong/${pathLang}/${letter}${n}`;
  }
  const pathLang = lang === "hebrew" ? "hebrew" : "greek";
  return `https://midvash.com/strongs-concordance/${pathLang}/${letter}${n}`;
}
