import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CATALOG, mapCatalog } from "./catalog.ts";
import {
  htmlToText,
  paragraphsFromHtml,
  pickParagraphs,
  parseRetrieved,
} from "./retrieve.ts";

describe("primary-source mapping", () => {
  it("indexes a broad primary-source set with unique ids", () => {
    assert.ok(CATALOG.length >= 60, `catalog is ${CATALOG.length}`);
    const ids = CATALOG.map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("maps Aquinas + predestination to ST I q.23", () => {
    const hits = mapCatalog({
      question: "what did Aquinas say about predestination",
    });
    assert.ok(hits.some((h) => h.id === "aquinas-st-predestination"));
    assert.equal(hits[0]?.voice, "Thomas Aquinas");
  });

  it("maps John 1 Word to Augustine tractate and Calvin commentary", () => {
    const hits = mapCatalog({
      question: "Word",
      bookId: "JHN",
      chapter: 1,
      verseText: "In the beginning was the Word",
    });
    const ids = hits.map((h) => h.id);
    assert.ok(ids.includes("augustine-john-tr1"));
    assert.ok(ids.includes("calvin-john-1"));
  });

  it("maps Colossians 1:24 to Calvin commentary", () => {
    const hits = mapCatalog({
      question: "sufferings of Christ",
      bookId: "COL",
      chapter: 1,
      verseText:
        "Now I rejoice in my sufferings for you, and fill up that which is behind of the afflictions of Christ in my flesh for his body's sake, which is the church",
    });
    const ids = hits.map((h) => h.id);
    assert.ok(
      hits.some((h) => h.voice === "John Calvin" && (h.books?.includes("COL") ?? false)),
      `expected Calvin on COL, got ${ids.join(",")}`,
    );
    assert.ok(ids.includes("calvin-colossians-1"), `expected calvin-colossians-1, got ${ids.join(",")}`);
  });

  it("diversifies traditions mode", () => {
    const hits = mapCatalog({
      question: "predestination election",
      mode: "traditions",
    });
    const traditions = new Set(hits.map((h) => h.tradition));
    assert.ok(traditions.size >= 2);
  });
});

describe("html extract", () => {
  it("strips scripts and keeps treatise text", () => {
    const html = `<html><script>alert(1)</script><p>The Word was not made, for by the Word were all things made.</p>`;
    const text = htmlToText(html);
    assert.equal(text.includes("alert"), false);
    assert.ok(text.includes("The Word was not made"));
  });

  it("picks paragraphs that treat the term", () => {
    const html = `<p>Weather notes for the voyage and the harbor tide.</p><p>Predestination is the plan of God by which he directs some to eternal life, not a passing mention of the word in an objection.</p>`;
    const paras = pickParagraphs(paragraphsFromHtml(html), "predestination");
    assert.equal(paras.length, 1);
    assert.ok(paras[0].toLowerCase().includes("predestination"));
  });
});

describe("retrieved JSON", () => {
  it("keeps url on a valid card", () => {
    const cards = parseRetrieved(
      JSON.stringify({
        cards: [
          {
            voice: "Augustine",
            work: "Tractates on John 1",
            tradition: "patristic",
            quote: "The Word was not made.",
            citation: "Tractate 1",
            paraphrased: false,
            url: "https://www.newadvent.org/fathers/1701001.htm",
          },
        ],
      }),
    );
    assert.equal(cards.length, 1);
    assert.equal(cards[0].url, "https://www.newadvent.org/fathers/1701001.htm");
  });
});
