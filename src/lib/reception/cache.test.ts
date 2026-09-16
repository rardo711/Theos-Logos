import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  verseKey,
  storageKey,
  versePartOfStoreKey,
  getCached,
  saveCached,
  removeCached,
  clearAllCached,
} from "./cache.ts";

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

describe("locale-keyed storage", () => {
  beforeEach(() => {
    clearAllCached();
  });

  it("storageKey appends locale; versePart strips it", () => {
    assert.equal(storageKey("ROM", 9, 16, null, "es"), "ROM-9-16|es");
    assert.equal(storageKey("ROM", 9, 16, null, "en"), "ROM-9-16|en");
    assert.equal(versePartOfStoreKey("ROM-9-16|es"), "ROM-9-16");
    assert.equal(versePartOfStoreKey("ROM-9-14-16|en"), "ROM-9-14-16");
  });

  it("ES and EN desks stay independent — switching locale does not stick ES", () => {
    const esResult = {
      source: "generated" as const,
      cards: [
        {
          voice: "John Calvin",
          work: "Commentary",
          tradition: "reformed" as const,
          quote: "elección de gracia",
          citation: "Rom 9:11",
          source: "curated" as const,
        },
      ],
    };
    const enResult = {
      source: "generated" as const,
      cards: [
        {
          voice: "John Calvin",
          work: "Commentary",
          tradition: "reformed" as const,
          quote: "election of grace",
          citation: "Rom 9:11",
          source: "curated" as const,
        },
      ],
    };

    saveCached("ROM", 9, 11, esResult, null, "es");
    saveCached("ROM", 9, 11, enResult, null, "en");

    const loadedEs = getCached("ROM", 9, 11, null, "es");
    const loadedEn = getCached("ROM", 9, 11, null, "en");
    assert.equal(loadedEs?.cards[0].quote, "elección de gracia");
    assert.equal(loadedEn?.cards[0].quote, "election of grace");

    removeCached("ROM", 9, 11, null, "es");
    assert.equal(getCached("ROM", 9, 11, null, "es"), null);
    assert.equal(
      getCached("ROM", 9, 11, null, "en")?.cards[0].quote,
      "election of grace",
    );
  });
});
