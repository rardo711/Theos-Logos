import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mapBollsHits } from "./search.ts";

describe("mapBollsHits", () => {
  it("maps v2 find results onto desk books", () => {
    const hits = mapBollsHits(
      {
        results: [
          {
            book: 43,
            chapter: 1,
            verse: 1,
            text: "<i>In the beginning</i> was the Word.",
          },
          { book: 99, chapter: 1, verse: 1, text: "skip" },
        ],
      },
      "en",
    );
    assert.equal(hits.length, 1);
    assert.equal(hits[0]?.bookId, "JHN");
    assert.equal(hits[0]?.bookName, "John");
    assert.equal(hits[0]?.text, "In the beginning was the Word.");
  });

  it("names Spanish books", () => {
    const hits = mapBollsHits(
      [{ book: 43, chapter: 1, verse: 14, text: "Y aquel Verbo" }],
      "es",
    );
    assert.equal(hits[0]?.bookName, "Juan");
  });
});
