import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { esvQuery, parseEsvPassage } from "./esv.ts";
import { getBook } from "./books.ts";

describe("parseEsvPassage", () => {
  it("splits bracketed verse numbers and collapses whitespace", () => {
    const raw = `
  [1] Alpha word one. [2] Beta word two.
      [3] Gamma
          word three.
 (ESV)
`;
    assert.deepEqual(parseEsvPassage(raw), [
      { verse: 1, text: "Alpha word one." },
      { verse: 2, text: "Beta word two." },
      { verse: 3, text: "Gamma word three." },
    ]);
  });

  it("returns empty when no verse markers", () => {
    assert.deepEqual(parseEsvPassage("plain prose without numbers"), []);
  });
});

describe("esvQuery", () => {
  it("uses Psalm (singular) for the Psalter", () => {
    assert.equal(esvQuery(getBook("PSA"), 119), "Psalm 119");
  });

  it("keeps the canonical book name otherwise", () => {
    assert.equal(esvQuery(getBook("JHN"), 1), "John 1");
    assert.equal(esvQuery(getBook("1CO"), 13), "1 Corinthians 13");
  });
});
