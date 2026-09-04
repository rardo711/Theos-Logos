import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyVerseTap,
  inRange,
  isSingle,
  MAX_RANGE_VERSES,
  rangeLength,
  rangeVerses,
  type VerseRange,
} from "./range.ts";
import { formatReference, formatVerseSpan } from "./reference.ts";

const r = (start: number, end: number): VerseRange => ({ start, end });

describe("applyVerseTap", () => {
  it("selects a verse when nothing is selected", () => {
    assert.deepEqual(applyVerseTap(null, 14).range, r(14, 14));
  });

  it("extends upward to a verse above the range", () => {
    assert.deepEqual(applyVerseTap(r(14, 14), 16).range, r(14, 16));
  });

  it("extends downward to a verse below the range", () => {
    // The range grows to include what was tapped rather than pivoting on a
    // hidden anchor, so nothing the reader had selected silently disappears.
    assert.deepEqual(applyVerseTap(r(14, 16), 12).range, r(12, 16));
  });

  it("clears when the only selected verse is tapped", () => {
    assert.equal(applyVerseTap(r(16, 16), 16).range, null);
  });

  it("trims from the end when the last verse is tapped", () => {
    assert.deepEqual(applyVerseTap(r(14, 16), 16).range, r(14, 15));
  });

  it("trims from the start when the first verse is tapped", () => {
    assert.deepEqual(applyVerseTap(r(14, 16), 14).range, r(15, 16));
  });

  it("collapses to one verse when the middle is tapped", () => {
    assert.deepEqual(applyVerseTap(r(14, 18), 16).range, r(16, 16));
  });

  it("trimming a two-verse range leaves the other verse selected", () => {
    assert.deepEqual(applyVerseTap(r(14, 15), 15).range, r(14, 14));
    assert.deepEqual(applyVerseTap(r(14, 15), 14).range, r(15, 15));
  });

  it("refuses an extension past the cap and keeps the range unchanged", () => {
    const long = r(1, MAX_RANGE_VERSES);
    const out = applyVerseTap(long, MAX_RANGE_VERSES + 1);
    assert.equal(out.refused, "too-long");
    assert.deepEqual(out.range, long);
  });

  it("allows an extension that lands exactly on the cap", () => {
    const out = applyVerseTap(r(1, MAX_RANGE_VERSES - 1), MAX_RANGE_VERSES);
    assert.equal(out.refused, undefined);
    assert.equal(rangeLength(out.range!), MAX_RANGE_VERSES);
  });

  it("jumps to the far verse when asked instead of refusing", () => {
    const long = r(1, MAX_RANGE_VERSES);
    const out = applyVerseTap(long, MAX_RANGE_VERSES + 5, {
      ifTooLong: "jump",
    });
    assert.equal(out.refused, undefined);
    assert.deepEqual(out.range, r(MAX_RANGE_VERSES + 5, MAX_RANGE_VERSES + 5));
  });

  it("refuses a downward extension past the cap too", () => {
    const out = applyVerseTap(r(20, 20 + MAX_RANGE_VERSES - 1), 1);
    assert.equal(out.refused, "too-long");
  });
});

describe("range helpers", () => {
  it("inRange covers the endpoints", () => {
    assert.equal(inRange(r(14, 16), 14), true);
    assert.equal(inRange(r(14, 16), 16), true);
    assert.equal(inRange(r(14, 16), 13), false);
    assert.equal(inRange(null, 14), false);
  });

  it("isSingle distinguishes a verse from a passage", () => {
    assert.equal(isSingle(r(16, 16)), true);
    assert.equal(isSingle(r(14, 16)), false);
    assert.equal(isSingle(null), false);
  });

  it("rangeVerses lists every verse inclusively", () => {
    assert.deepEqual(rangeVerses(r(14, 16)), [14, 15, 16]);
    assert.deepEqual(rangeVerses(r(9, 9)), [9]);
  });
});

describe("formatReference", () => {
  it("renders the three shapes", () => {
    assert.equal(formatReference("Romans", 9), "Romans 9");
    assert.equal(formatReference("Romans", 9, 16), "Romans 9:16");
    assert.equal(formatReference("Romans", 9, 14, 16), "Romans 9:14-16");
  });

  it("treats an end at or below the start as a single verse", () => {
    assert.equal(formatReference("Romans", 9, 16, 16), "Romans 9:16");
    assert.equal(formatReference("Romans", 9, 16, null), "Romans 9:16");
  });

  it("formatVerseSpan drops the book for a card caption", () => {
    assert.equal(formatVerseSpan(16), "16");
    assert.equal(formatVerseSpan(14, 16), "14-16");
    assert.equal(formatVerseSpan(16, 16), "16");
  });
});
