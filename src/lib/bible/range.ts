/**
 * Contiguous verse ranges and the tap rules that build them.
 *
 * Kept free of React and of the store so the rules can be tested directly:
 * this is the part of multi-verse selection with actual behaviour in it, and
 * "what happens when I tap a verse already in the range" is not a question to
 * answer by clicking around in a browser.
 *
 * The range carries no anchor. An anchor makes a tap outside the range
 * ambiguous -- extending from the anchor silently drops the far half of what
 * the reader had selected -- so instead the range simply grows to include
 * whatever was tapped, and shrinks from whichever edge was tapped. Every tap
 * is then a local edit to the block on screen, with nothing invisible
 * deciding the outcome.
 */

/**
 * A selection longer than this is a chapter, not a passage. Retrieval treats a
 * range as one locus, so a long range does not cost extra fetches, but it does
 * widen the net for catalog rows and asks the librarian to hold too much at
 * once. Twelve covers the long pericopes (Romans 9:1-13 is thirteen; the
 * reader can take that in two passes).
 */
export const MAX_RANGE_VERSES = 12;

export interface VerseRange {
  start: number;
  end: number;
}

export type TapOutcome = {
  range: VerseRange | null;
  /** Set when the tap was refused, so the caller can say why. */
  refused?: "too-long";
};

export function rangeLength(range: VerseRange): number {
  return range.end - range.start + 1;
}

export function isSingle(range: VerseRange | null): boolean {
  return range != null && range.start === range.end;
}

export function inRange(range: VerseRange | null, verse: number): boolean {
  return range != null && verse >= range.start && verse <= range.end;
}

export function rangeVerses(range: VerseRange): number[] {
  const out: number[] = [];
  for (let v = range.start; v <= range.end; v++) out.push(v);
  return out;
}

/**
 * The whole selection grammar for select mode. Returns the range after the
 * tap, or null when the tap cleared the selection.
 *
 *   nothing selected      -> select that verse alone
 *   tap below the range   -> extend down to it
 *   tap above the range   -> extend up to it
 *   tap the only verse    -> clear
 *   tap the first verse   -> drop it, range starts one later
 *   tap the last verse    -> drop it, range ends one earlier
 *   tap inside the range  -> collapse to that verse alone
 */
export function applyVerseTap(
  range: VerseRange | null,
  verse: number,
): TapOutcome {
  if (range == null) return { range: { start: verse, end: verse } };

  if (verse < range.start) {
    const next = { start: verse, end: range.end };
    return rangeLength(next) > MAX_RANGE_VERSES
      ? { range, refused: "too-long" }
      : { range: next };
  }

  if (verse > range.end) {
    const next = { start: range.start, end: verse };
    return rangeLength(next) > MAX_RANGE_VERSES
      ? { range, refused: "too-long" }
      : { range: next };
  }

  // Inside the range from here down.
  if (range.start === range.end) return { range: null };
  if (verse === range.start) return { range: { start: range.start + 1, end: range.end } };
  if (verse === range.end) return { range: { start: range.start, end: range.end - 1 } };
  return { range: { start: verse, end: verse } };
}
