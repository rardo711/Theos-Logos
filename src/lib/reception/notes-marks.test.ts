import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { markedChapters, markedVerses } from "./notes.ts";

describe("library marks", () => {
  it("dots John chapters that have desk notes, not verse numbers", () => {
    const chapters = markedChapters("JHN");
    assert.ok(chapters.includes(1), "John 1 has curated notes");
    assert.ok(
      !chapters.includes(99),
      "a book does not grow a 99th chapter from verse 99",
    );
  });

  it("keeps verse marks scoped to the chapter they belong to", () => {
    const john1 = markedVerses("JHN", 1);
    assert.ok(john1.includes(1), "John 1:1 is marked");
    const asChapters = markedChapters("JHN");
    for (const verse of john1) {
      if (verse > 21) {
        assert.equal(
          asChapters.includes(verse),
          false,
          `verse ${verse} must not paint a chapter pill`,
        );
      }
    }
  });
});
