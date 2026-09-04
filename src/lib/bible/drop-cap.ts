/**
 * First letter of a chapter's opening verse, for the lectern drop-cap.
 * Null when the verse does not start with a letter.
 */
export function splitDropCap(
  text: string,
): { letter: string; rest: string } | null {
  const m = text.match(/^(\p{L})(.*)$/u);
  if (!m) return null;
  return { letter: m[1], rest: m[2] };
}
