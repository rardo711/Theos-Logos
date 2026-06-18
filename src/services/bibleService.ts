import { BibleChapter, BIBLE_BOOKS } from "../types";
import { ES_BOOK_NAMES, Lang } from "../i18n";
import { getEsvHeading } from "../data/esvHeadings";

const cache = new Map<string, BibleChapter>();

interface TranslationMeta {
  code: string; // Bolls Life translation code
  id: string;
  name: string;
  note: string;
}

const TRANSLATIONS: Record<Lang, TranslationMeta> = {
  en: {
    code: "ESV",
    id: "esv",
    name: "English Standard Version",
    note: "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.",
  },
  es: {
    code: "RV1960",
    id: "rvr1960",
    name: "Reina-Valera 1960",
    note: "Texto bíblico tomado de la Versión Reina-Valera 1960 © Sociedades Bíblicas en América Latina, 1960. Renovado © Sociedades Bíblicas Unidas, 1988. Utilizado con permiso.",
  },
};

export async function fetchBibleChapter(
  book: string,
  chapter: number,
  lang: Lang = "en",
): Promise<BibleChapter> {
  const normalizedBookId = book.trim().toUpperCase();
  const cacheKey = `${lang}_${normalizedBookId}_${chapter}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const bookInfo = BIBLE_BOOKS.find(b => b.id.toUpperCase() === normalizedBookId);
  const englishName = bookInfo?.name || book;
  const bookName =
    lang === "es" ? (ES_BOOK_NAMES[normalizedBookId] ?? englishName) : englishName;
  const bookIndex = BIBLE_BOOKS.findIndex(b => b.id.toUpperCase() === normalizedBookId) + 1;
  const meta = TRANSLATIONS[lang];

  console.log(`[BibleService] Fetching: ${bookName} ${chapter} (${meta.code})`);

  let result: BibleChapter | null = null;

  // Primary: backend proxy (Bolls API), translation chosen by language
  if (bookIndex > 0) {
    try {
      const url = `/api/bible/${meta.code}?bookId=${bookIndex}&chapter=${chapter}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json(); // Array of { verse: number, text: string }

        if (Array.isArray(data) && data.length > 0) {
          console.log(`[BibleService] ${meta.code} Success: ${bookName} ${chapter}`);
          // Diagnostic: log the first verse's fields once so server logs reveal
          // exactly what Bolls returns (especially whether 'title' is present).
          if (data[0]) console.log(`[BibleService] first verse fields:`, Object.keys(data[0]));

          const verses: { book_id: string; book_name: string; chapter: number; verse: number; text: string; title?: string }[] = data.map((v: any) => {
            // Bolls may supply the section heading in different fields depending
            // on the translation version served. Check in priority order:
            //   1. v.title  — most common
            //   2. v.heading — some Bolls builds use this name
            //   3. An <h3>/<h4> tag embedded at the START of v.text
            // All candidates have HTML stripped and are treated as empty when blank.
            const extractTag = (html: string, tag: string) => {
              const m = html.match(new RegExp(`<${tag}[^>]*>(.*?)<\\/${tag}>`, "i"));
              return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
            };
            const rawTitle =
              (typeof v.title === "string" ? v.title.replace(/<[^>]+>/g, "").trim() : "") ||
              (typeof v.heading === "string" ? v.heading.replace(/<[^>]+>/g, "").trim() : "") ||
              (typeof v.section === "string" ? v.section.replace(/<[^>]+>/g, "").trim() : "") ||
              extractTag(typeof v.text === "string" ? v.text : "", "h3") ||
              extractTag(typeof v.text === "string" ? v.text : "", "h4");

            // Strip ALL HTML tags from the verse body after we've mined headings.
            const cleanText = (typeof v.text === "string" ? v.text : "")
              .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, "") // remove embedded heading tags
              .replace(/<[^>]+>/g, "")                      // strip remaining tags
              .trim();

            return {
              book_id: book,
              book_name: bookName,
              chapter: chapter,
              verse: v.verse,
              text: cleanText,
              title: rawTitle || getEsvHeading(normalizedBookId, chapter, v.verse) || undefined,
            };
          });

          result = {
            reference: `${bookName} ${chapter}`,
            verses: verses,
            text: verses.map(v => `[${v.verse}] ${v.text}`).join(' '),
            translation_id: meta.id,
            translation_name: meta.name,
            translation_note: meta.note,
          };
        } else {
          console.warn(`[BibleService] ${meta.code} response had no valid text array`);
        }
      } else {
        const errText = await response.text().catch(() => "Unknown error");
        console.warn(`[BibleService] ${meta.code} API Error ${response.status}: ${errText}`);
      }
    } catch (error: any) {
      console.warn(`[BibleService] ${meta.code} API request failed:`, error.message || error);
    }
  }

  // Fallback to bible-api.com (WEB, English only — uses English book names)
  if (!result) {
    try {
      const safeBookName = englishName.replace(/ /g, '+');
      const fallbackUrl = `https://bible-api.com/${encodeURIComponent(safeBookName)}+${chapter}`;
      console.log(`[BibleService] Trying fallback: ${fallbackUrl}`);

      const response = await fetch(fallbackUrl);
      if (!response.ok) {
        throw new Error(`Fallback API returned status ${response.status}`);
      }

      const data = await response.json();
      console.log(`[BibleService] Fallback Success: ${data.reference}`);
      result = processFallbackResponse(data);
    } catch (error: any) {
      console.error("[BibleService] All Bible API attempts failed", error);
      throw new Error(
        lang === "es"
          ? "No se pudo cargar el texto bíblico. Verifique su conexión o intente con otro capítulo."
          : "Unable to load Bible text. Please check your connection or try another chapter.",
      );
    }
  }

  cache.set(cacheKey, result);
  return result;
}

export interface BibleSearchResult {
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export async function searchBible(
  query: string,
  translation: "ESV" | "RV1960" = "ESV",
): Promise<BibleSearchResult[]> {
  const res = await fetch(
    `/api/bible/search?q=${encodeURIComponent(query)}&translation=${translation}`,
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Search failed" }));
    throw new Error(err.error || "Search failed");
  }
  const raw = await res.json();
  if (!Array.isArray(raw)) return [];
  // Bolls returns a numeric book id (1=Genesis … 66=Revelation, the same
  // ordinal used by fetchBibleChapter) and HTML-laden text — normalize both.
  return raw
    .map((r: any): BibleSearchResult | null => {
      const book = BIBLE_BOOKS[Number(r.book) - 1];
      if (!book) return null;
      const book_name =
        translation === "RV1960" ? (ES_BOOK_NAMES[book.id] ?? book.name) : book.name;
      return {
        book_name,
        chapter: Number(r.chapter),
        verse: Number(r.verse),
        text: String(r.text ?? "").replace(/<[^>]+>/g, "").trim(),
      };
    })
    .filter((r): r is BibleSearchResult => r !== null);
}

function processFallbackResponse(data: any): BibleChapter {
  if (!data || !data.verses || !Array.isArray(data.verses)) {
    throw new Error("Invalid data received from fallback Bible API");
  }

  return {
    reference: data.reference || "Unknown Reference",
    verses: data.verses.map((v: any) => ({
      book_id: v.book_id || "",
      book_name: v.book_name || "",
      chapter: v.chapter || 0,
      verse: v.verse || 0,
      text: (v.text || "").trim()
    })),
    text: data.text || "",
    translation_id: data.translation_id || "web",
    translation_name: data.translation_name || "World English Bible",
    translation_note: data.translation_note || "Public Domain"
  };
}
