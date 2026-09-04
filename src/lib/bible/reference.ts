/**
 * One place that turns a book, chapter and verse span into the string a reader
 * recognises. This was built inline in the reception panel and again as refOf
 * in ask.ts, which meant a range would have had to be formatted correctly in
 * two places that had already drifted apart once.
 */
export function formatReference(
  bookName: string,
  chapter: number,
  verse?: number | null,
  verseEnd?: number | null,
): string {
  if (verse == null) return `${bookName} ${chapter}`;
  if (verseEnd == null || verseEnd <= verse) {
    return `${bookName} ${chapter}:${verse}`;
  }
  return `${bookName} ${chapter}:${verse}-${verseEnd}`;
}

/** "16" or "14-16" -- for a caption on a card whose locus is narrower than the selection. */
export function formatVerseSpan(verse: number, verseEnd?: number | null): string {
  return verseEnd == null || verseEnd <= verse ? `${verse}` : `${verse}-${verseEnd}`;
}
