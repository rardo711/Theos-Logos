import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { bollsBookId, bookName, findBook, getBook } from "./books.ts";
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

  it("strips commentary markup from a verse", () => {
    assert.equal(
      stripBollsHtml("<p><b>Cristo</b> viene al mundo</p>"),
      "Cristo viene al mundo",
    );
  });
});
