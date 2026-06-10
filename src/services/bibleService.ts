import { BibleChapter, BIBLE_BOOKS } from "../types";

const cache = new Map<string, BibleChapter>();

export async function fetchBibleChapter(book: string, chapter: number): Promise<BibleChapter> {
  const normalizedBookId = book.trim().toUpperCase();
  const cacheKey = `${normalizedBookId}_${chapter}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const bookInfo = BIBLE_BOOKS.find(b => b.id.toUpperCase() === normalizedBookId);
  const bookName = bookInfo?.name || book;
  const bookIndex = BIBLE_BOOKS.findIndex(b => b.id.toUpperCase() === normalizedBookId) + 1;
  
  console.log(`[BibleService] Fetching: ${bookName} ${chapter} (ID: ${book})`);

  let result: BibleChapter | null = null;

  // Always try ESV backend proxy first (Bolls API)
  if (bookIndex > 0) {
    try {
      const url = `/api/bible/esv?bookId=${bookIndex}&chapter=${chapter}`;
      
      console.log(`[BibleService] Requesting ESV Proxy: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json(); // Array of { verse: number, text: string }

        if (Array.isArray(data) && data.length > 0) {
          console.log(`[BibleService] ESV Success: ${bookName} ${chapter}`);
          
          const verses: { book_id: string; book_name: string; chapter: number; verse: number; text: string }[] = data.map((v: any) => ({
            book_id: book,
            book_name: bookName,
            chapter: chapter,
            verse: v.verse,
            text: v.text.replace(/<[^>]+>/g, '') // strip any crude HTML just in case
          }));

          result = {
            reference: `${bookName} ${chapter}`,
            verses: verses,
            text: verses.map(v => `[${v.verse}] ${v.text}`).join(' '),
            translation_id: "esv",
            translation_name: "English Standard Version",
            translation_note: "Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved."
          };
        } else {
          console.warn("[BibleService] ESV response had no valid text array");
        }
      } else {
        const errText = await response.text().catch(() => "Unknown error");
        console.warn(`[BibleService] ESV API Error ${response.status}: ${errText}`);
      }
    } catch (error: any) {
      console.warn("[BibleService] ESV API request failed:", error.message || error);
    }
  }

  // Fallback to bible-api.com (WEB)
  if (!result) {
    try {
      const safeBookName = bookName.replace(/ /g, '+');
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
      throw new Error("Unable to load Bible text. Please check your connection or try another chapter.");
    }
  }

  cache.set(cacheKey, result);
  return result;
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
