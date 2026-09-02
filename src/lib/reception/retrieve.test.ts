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

  it("maps Ephesians 1:3 to Calvin and Henry chapter pages, not only Argument", () => {
    const hits = mapCatalog({
      question: "",
      bookId: "EPH",
      chapter: 1,
      verseText:
        "Blessed be the God and Father of our Lord Jesus Christ, who has blessed us in Christ with every spiritual blessing in the heavenly places",
    });
    const ids = hits.map((h) => h.id);
    const calvin = hits.find((h) => h.id === "calvin-ephesians-1");
    const henry = hits.find((h) => h.id === "henry-ephesians-1");
    assert.ok(calvin, `expected calvin-ephesians-1, got ${ids.join(",")}`);
    assert.ok(henry, `expected henry-ephesians-1, got ${ids.join(",")}`);
    assert.ok(calvin.chapters?.includes(1), "Calvin hit must be a chapter page");
    assert.ok(henry.chapters?.includes(1), "Henry hit must be a chapter page");
    assert.match(calvin.url, /calcom41\.iv\.ii/);
    assert.equal(calvin.url.includes("calcom41.iv.i.html"), false);
    assert.match(henry.url, /Eph\.ii/);
    assert.equal(/Eph\.i\.html$/.test(henry.url), false);
  });

  it("maps mid-book NT verses to Henry/Calvin CHAPTER urls, not only Argument", () => {
    const cases = [
      {
        bookId: "ROM",
        chapter: 8,
        verseText:
          "There is therefore now no condemnation to them which are in Christ Jesus",
      },
      {
        bookId: "JHN",
        chapter: 3,
        verseText: "For God so loved the world, that he gave his only begotten Son",
      },
      {
        bookId: "JAS",
        chapter: 1,
        verseText: "Count it all joy when ye fall into divers temptations",
      },
      {
        bookId: "REV",
        chapter: 1,
        verseText:
          "The Revelation of Jesus Christ, which God gave unto him, to shew unto his servants things which must shortly come to pass; and he sent and signified it by his angel unto his servant John",
      },
    ];
    for (const c of cases) {
      const hits = mapCatalog({
        question: "",
        bookId: c.bookId,
        chapter: c.chapter,
        verseText: c.verseText,
      });
      const ids = hits.map((h) => h.id);
      const chapterHits = hits.filter(
        (h) =>
          (h.voice === "John Calvin" || h.voice === "Matthew Henry") &&
          (h.books?.includes(c.bookId) ?? false) &&
          (h.chapters?.includes(c.chapter) ?? false),
      );
      assert.ok(
        chapterHits.length >= 1,
        `expected Henry/Calvin chapter page for ${c.bookId} ${c.chapter}, got ${ids.join(",")}`,
      );
      for (const h of chapterHits) {
        assert.equal(/argument/i.test(h.locus), false, h.id);
        assert.equal(/\bintro\b/i.test(h.locus), false, h.id);
        if (h.voice === "Matthew Henry") {
          assert.equal(
            /mhc[56]\.[A-Za-z]+\.i\.html$/.test(h.url),
            false,
            h.url,
          );
        }
      }
    }
  });

  it("maps Revelation 1:1 full verse to henry-revelation-1 chapter page, not Argument", () => {
    const hits = mapCatalog({
      question: "",
      bookId: "REV",
      chapter: 1,
      verseText:
        "The Revelation of Jesus Christ, which God gave unto him, to shew unto his servants things which must shortly come to pass; and he sent and signified it by his angel unto his servant John",
    });
    const ids = hits.map((h) => h.id);
    const henry = hits.find((h) => h.id === "henry-revelation-1");
    assert.ok(henry, `expected henry-revelation-1 in mapCatalog, got ${ids.join(",")}`);
    assert.match(henry.url, /Rev\.ii/);
    assert.equal(/Rev\.i\.html$/.test(henry.url), false);
    assert.ok(henry.chapters?.includes(1), "must be a chapter page, not only Argument");
    assert.equal(/argument/i.test(henry.locus), false);
  });

  it("maps 1 John 1:1 full verse to henry-1john-1, not Gospel of John pages", () => {
    const hits = mapCatalog({
      question: "",
      bookId: "1JN",
      chapter: 1,
      verseText:
        "That which was from the beginning, which we have heard, which we have seen with our eyes, which we have looked upon, and our hands have handled, of the Word of life",
    });
    const ids = hits.map((h) => h.id);
    const henryIdx = ids.indexOf("henry-1john-1");
    assert.ok(henryIdx >= 0, `expected henry-1john-1, got ${ids.join(",")}`);
    for (const drown of ["augustine-john-tr1", "calvin-john-1", "chrysostom-john-h1"]) {
      const di = ids.indexOf(drown);
      assert.ok(
        di < 0 || henryIdx < di,
        `${drown} must not top henry-1john-1, got ${ids.join(",")}`,
      );
    }
  });

  it("maps empty Inquire on 2 John and 3 John to Henry chapter-1 over Gospel John", () => {
    for (const c of [
      { bookId: "2JN", id: "henry-2john-1" },
      { bookId: "3JN", id: "henry-3john-1" },
    ]) {
      const hits = mapCatalog({
        question: "",
        bookId: c.bookId,
        chapter: 1,
      });
      const ids = hits.map((h) => h.id);
      const idx = ids.indexOf(c.id);
      assert.ok(idx >= 0, `expected ${c.id} for empty Inquire, got ${ids.join(",")}`);
      for (const drown of ["augustine-john-tr1", "calvin-john-1", "chrysostom-john-h1", "henry-john-1"]) {
        const di = ids.indexOf(drown);
        assert.ok(
          di < 0 || idx < di,
          `${drown} must not top ${c.id}, got ${ids.join(",")}`,
        );
      }
    }
  });

  it("prefers the inquired book's chapter page for Word/logos outside the Gospel of John", () => {
    const cases = [
      {
        bookId: "HEB",
        chapter: 4,
        verseText:
          "For the word of God is quick, and powerful, and sharper than any twoedged sword",
        ids: ["henry-hebrews-4", "calvin-hebrews-4"],
      },
      {
        bookId: "REV",
        chapter: 19,
        verseText:
          "And he was clothed with a vesture dipped in blood: and his name is called The Word of God",
        ids: ["henry-revelation-19"],
      },
    ];
    for (const c of cases) {
      const hits = mapCatalog({
        question: "word logos",
        bookId: c.bookId,
        chapter: c.chapter,
        verseText: c.verseText,
      });
      const ids = hits.map((h) => h.id);
      const bookHit = c.ids
        .map((id) => ids.indexOf(id))
        .filter((i) => i >= 0)
        .sort((a, b) => a - b)[0];
      assert.ok(
        bookHit != null,
        `expected one of ${c.ids.join(",")} for ${c.bookId} ${c.chapter}, got ${ids.join(",")}`,
      );
      for (const drown of ["augustine-john-tr1", "calvin-john-1", "chrysostom-john-h1"]) {
        const di = ids.indexOf(drown);
        assert.ok(
          di < 0 || bookHit < di,
          `${drown} must not top ${c.bookId} chapter page, got ${ids.join(",")}`,
        );
      }
    }
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
