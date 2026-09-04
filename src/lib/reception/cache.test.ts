import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { verseKey } from "./cache.ts";

describe("verseKey", () => {
  it("gives a single verse the exact key it had before ranges existed", () => {
    // Every desk cached to localStorage before this feature is keyed this way.
    // Change the shape and the reader silently loses their saved work.
    assert.equal(verseKey("ROM", 9, 16), "ROM-9-16");
    assert.equal(verseKey("ROM", 9, 16, null), "ROM-9-16");
    assert.equal(verseKey("ROM", 9, 16, 16), "ROM-9-16");
    // An end below the start is meaningless; treat it as the single verse.
    assert.equal(verseKey("ROM", 9, 16, 14), "ROM-9-16");
  });

  it("appends the end verse for a real range", () => {
    assert.equal(verseKey("ROM", 9, 14, 16), "ROM-9-14-16");
  });

  it("keeps a range distinct from its first verse", () => {
    assert.notEqual(verseKey("ROM", 9, 14, 16), verseKey("ROM", 9, 14));
  });
});
