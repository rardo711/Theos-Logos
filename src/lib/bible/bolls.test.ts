import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { bollsBookId, bookName, findBook, getBook, parseReference } from "./books.ts";
import { stripBollsHtml } from "./bolls.ts";

describe("Spanish books", () => {
  it("maps Protestant order to bolls book numbers", () => {
    assert.equal(bollsBookId("GEN"), 1);
    assert.equal(bollsBookId("PSA"), 19);
    assert.equal(bollsBookId("MAT"), 40);
    assert.equal(bollsBookId("JHN"), 43);
    assert.equal(bollsBookId("REV"), 66);
  });

  it("names Juan in Spanish", () => {
    assert.equal(bookName(getBook("JHN"), "es"), "Juan");
    assert.equal(findBook("Juan")?.id, "JHN");
    assert.equal(findBook("Salmos")?.id, "PSA");
  });

  it("parses a verse reference", () => {
    const hit = parseReference("John 1:14");
    assert.equal(hit?.book.id, "JHN");
    assert.equal(hit?.chapter, 1);
    assert.equal(hit?.verse, 14);
    const es = parseReference("Juan 1:1");
    assert.equal(es?.book.id, "JHN");
    assert.equal(es?.verse, 1);
  });

  it("strips commentary markup from a verse", () => {
    assert.equal(
      stripBollsHtml("<p><b>Cristo</b> viene al mundo</p>"),
      "Cristo viene al mundo",
    );
  });
});
