import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getCuratedCardsForRange,
  getCuratedCardsForVerse,
} from "./curated.ts";

const voicesOf = (cards: { voice: string }[]) => cards.map((c) => c.voice);

function countByVoice(cards: { voice: string }[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const c of cards) {
    const k = c.voice.trim().toLowerCase();
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

describe("curated cards for a range", () => {
  it("a range inside one pericope returns what its canonical verse returns", () => {
    // Romans 9:14-18 is one pericope. The per-verse lookup already redirects
    // every verse in it to the same canonical verse, so treating the range as
    // one locus must not multiply the cards.
    const single = getCuratedCardsForVerse("ROM", 9, 16);
    const range = getCuratedCardsForRange("ROM", 9, 14, 18);
    assert.ok(single.length > 0, "fixture check: 9:16 has curated cards");
    assert.deepEqual(voicesOf(range), voicesOf(single));
  });

  it("degenerate ranges fall through to the single-verse path", () => {
    const single = getCuratedCardsForVerse("ROM", 9, 16);
    assert.deepEqual(voicesOf(getCuratedCardsForRange("ROM", 9, 16, 16)), voicesOf(single));
    assert.deepEqual(voicesOf(getCuratedCardsForRange("ROM", 9, 16, 14)), voicesOf(single));
  });

  it("no voice appears more than twice across a multi-pericope range", () => {
    const range = getCuratedCardsForRange("ROM", 9, 11, 22);
    for (const [voice, n] of countByVoice(range)) {
      assert.ok(n <= 2, `${voice} appeared ${n} times`);
    }
  });

  it("caps the total so a long passage cannot flood the panel", () => {
    const range = getCuratedCardsForRange("ROM", 9, 11, 22);
    assert.ok(range.length <= 10, `got ${range.length} cards`);
  });

  it("keeps every voice when it has to truncate", () => {
    // Breadth before depth: a first-come cut would spend the panel on the
    // voices commenting earliest in the passage and drop the later ones.
    const wide = getCuratedCardsForRange("ROM", 9, 11, 22);
    const everyVoice = new Set<string>();
    for (let v = 11; v <= 22; v++) {
      for (const c of getCuratedCardsForVerse("ROM", 9, v)) {
        everyVoice.add(c.voice.trim().toLowerCase());
      }
    }
    const kept = new Set(countByVoice(wide).keys());
    for (const voice of everyVoice) {
      assert.ok(kept.has(voice), `${voice} was dropped entirely`);
    }
  });

  it("surfaces a pericope's cards from a range that only clips it", () => {
    // 9:1-12 holds one curated verse, 9:11, and the verses around it redirect
    // into the same pericope. The range returns that pericope's cards rather
    // than nothing, and does not multiply them per verse.
    const range = getCuratedCardsForRange("ROM", 9, 1, 12);
    assert.deepEqual(voicesOf(range), voicesOf(getCuratedCardsForVerse("ROM", 9, 11)));
  });

  it("returns nothing for a range with no curated content at all", () => {
    // 9:1-5 sits before the first curated pericope in the chapter.
    assert.deepEqual(getCuratedCardsForRange("ROM", 9, 1, 5), []);
    assert.deepEqual(getCuratedCardsForRange("PHM", 1, 1, 3), []);
  });
});
