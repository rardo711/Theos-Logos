import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BIBLE_BOOKS } from "./books.ts";
import { fetchRv1909Chapter, loadRv1909Book } from "./rv1909.ts";
import { findRv1909 } from "./search.ts";
import { getBook } from "./books.ts";

describe("RV1909 local text", () => {
  it("loads all 66 books", async () => {
    for (const book of BIBLE_BOOKS) {
      const data = await loadRv1909Book(book.id);
      assert.ok(data, `missing ${book.id}`);
      assert.equal(data.chapters.length, book.chapters);
    }
  });

  it("serves Genesis 1 with the expected text", async () => {
    const ch = await fetchRv1909Chapter(
      getBook("GEN"),
      1,
      "Reina Valera 1909",
      "Reina Valera 1909. Public domain.",
      "es",
    );
    assert.ok(ch);
    assert.equal(ch.verses.length, 31);
    assert.equal(
      ch.verses[0].text,
      "EN el principio crió Dios los cielos y la tierra.",
    );
    assert.equal(ch.translationName, "Reina Valera 1909");
    assert.equal(ch.bookName, "Génesis");
  });

  it("returns null for unknown books or chapters", async () => {
    assert.equal(await loadRv1909Book("NOPE"), null);
    const ch = await fetchRv1909Chapter(
      getBook("GEN"),
      999,
      "Reina Valera 1909",
      "",
      "es",
    );
    assert.equal(ch, null);
  });

  it("finds verses accent-insensitively", async () => {
    const hits = await findRv1909("espiritu");
    assert.ok(hits.length > 0);
    assert.ok(hits.length <= 24);
    const h1 = hits[0];
    assert.ok(h1.bookId && h1.chapter >= 1 && h1.verse >= 1 && h1.text);
  });
});
