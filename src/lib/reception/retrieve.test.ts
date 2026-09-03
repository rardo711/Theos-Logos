import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CATALOG, mapCatalog, scoreEntry, tokenize } from "./catalog.ts";
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

  it("maps Colossians 1:15 to the hymn page, not only 1:24 sufferings", () => {
    const hits = mapCatalog({
      question: "image of the invisible God",
      bookId: "COL",
      chapter: 1,
      verseText: "Who is the image of the invisible God, the firstborn of every creature",
    });
    const ids = hits.map((h) => h.id);
    assert.ok(
      ids.includes("calvin-colossians-1-hymn") || ids.includes("chrysostom-col-h3") || ids.includes("henry-colossians-1"),
      `expected Col 1 hymn/chapter page, got ${ids.join(",")}`,
    );
    assert.ok(hits[0]?.books?.includes("COL"), `top hit must be Colossians, got ${ids.join(",")}`);
  });

  it("maps Colossians 2–4 to same-book chapter pages, not unbooked Christology", () => {
    const cases = [
      {
        chapter: 2,
        verseText: "See to it that no one takes you captive by philosophy and empty deceit",
        ids: ["calvin-colossians-2", "henry-colossians-2"],
      },
      {
        chapter: 3,
        verseText: "For you have died, and your life is hidden with Christ in God",
        ids: ["calvin-colossians-3", "henry-colossians-3"],
      },
      {
        chapter: 4,
        verseText: "Continue steadfastly in prayer, being watchful in it with thanksgiving",
        ids: ["calvin-colossians-4", "henry-colossians-4"],
      },
    ];
    for (const c of cases) {
      const hits = mapCatalog({
        question: c.chapter === 3 ? "hidden with Christ" : "",
        bookId: "COL",
        chapter: c.chapter,
        verseText: c.verseText,
      });
      const ids = hits.map((h) => h.id);
      for (const id of c.ids) {
        assert.ok(ids.includes(id), `expected ${id} for COL ${c.chapter}, got ${ids.join(",")}`);
      }
      assert.ok(
        hits[0]?.books?.includes("COL"),
        `COL ${c.chapter} top hit must be Colossians, got ${ids.join(",")}`,
      );
      assert.equal(
        ids.includes("irenaeus-ah-3-9") && ids.indexOf("irenaeus-ah-3-9") === 0,
        false,
        `Irenaeus must not lead COL ${c.chapter}, got ${ids.join(",")}`,
      );
    }
  });

  it("maps mid-book NT Henry chapter pages beyond the chapter-1 floor", () => {
    const cases = [
      { bookId: "1CO", chapter: 13, id: "henry-1corinthians-13" },
      { bookId: "PHP", chapter: 2, id: "henry-philippians-2" },
      { bookId: "MAT", chapter: 13, id: "henry-matthew-13" },
    ];
    for (const c of cases) {
      const hits = mapCatalog({
        question: "",
        bookId: c.bookId,
        chapter: c.chapter,
        verseText: "Christ Jesus",
      });
      const ids = hits.map((h) => h.id);
      assert.ok(ids.includes(c.id), `expected ${c.id}, got ${ids.join(",")}`);
      const henry = hits.find((h) => h.id === c.id);
      assert.ok(henry?.chapters?.includes(c.chapter));
      assert.equal(/argument/i.test(henry?.locus ?? ""), false);
    }
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


const NT_BOOKS = [
  "MAT", "MRK", "LUK", "JHN", "ACT", "ROM", "1CO", "2CO", "GAL", "EPH", "PHP",
  "COL", "1TH", "2TH", "1TI", "2TI", "TIT", "PHM", "HEB", "JAS", "1PE", "2PE",
  "1JN", "2JN", "3JN", "JUD", "REV",
] as const;

const CALVIN_SKIP = new Set(["2JN", "3JN", "REV"]);

/** First-clause verse-1 snippets (seed only has JHN-1). */
const NT_V1: Record<(typeof NT_BOOKS)[number], string> = {
  MAT: "The book of the generation of Jesus Christ",
  MRK: "The beginning of the gospel of Jesus Christ",
  LUK: "Forasmuch as many have taken in hand to set forth",
  JHN: "In the beginning was the Word",
  ACT: "The former treatise have I made, O Theophilus",
  ROM: "Paul, a servant of Jesus Christ, called to be an apostle",
  "1CO": "Paul, called to be an apostle of Jesus Christ",
  "2CO": "Paul, an apostle of Jesus Christ by the will of God",
  GAL: "Paul, an apostle, not of men, neither by man",
  EPH: "Paul, an apostle of Jesus Christ by the will of God",
  PHP: "Paul and Timotheus, the servants of Jesus Christ",
  COL: "Paul, an apostle of Jesus Christ by the will of God",
  "1TH": "Paul, and Silvanus, and Timotheus, unto the church",
  "2TH": "Paul, and Silvanus, and Timotheus, unto the church of the Thessalonians",
  "1TI": "Paul, an apostle of Jesus Christ by the commandment of God",
  "2TI": "Paul, an apostle of Jesus Christ by the will of God",
  TIT: "Paul, a servant of God, and an apostle of Jesus Christ",
  PHM: "Paul, a prisoner of Jesus Christ, and Timothy our brother",
  HEB: "God, who at sundry times and in divers manners",
  JAS: "James, a servant of God and of the Lord Jesus Christ",
  "1PE": "Peter, an apostle of Jesus Christ, to the strangers",
  "2PE": "Simon Peter, a servant and an apostle of Jesus Christ",
  "1JN": "That which was from the beginning, which we have heard",
  "2JN": "The elder unto the elect lady and her children",
  "3JN": "The elder unto the wellbeloved Gaius",
  JUD: "Jude, the servant of Jesus Christ, and brother of James",
  REV: "The Revelation of Jesus Christ, which God gave unto him, to shew unto his servants things which must shortly come to pass; and he sent and signified it by his angel unto his servant John",
};

const GOSPEL_JOHN_IDS = ["calvin-john-1", "augustine-john-tr1", "chrysostom-john-h1"];

describe("NT chapter-1 mapping", () => {
  it("picks same-book Henry ch.1 for every NT book, and Calvin except 2JN/3JN/REV", () => {
    assert.equal(NT_BOOKS.length, 27);
    const missingHenry: string[] = [];
    const missingCalvin: string[] = [];
    for (const bookId of NT_BOOKS) {
      const hits = mapCatalog({
        question: "",
        bookId,
        chapter: 1,
        verseText: NT_V1[bookId],
      });
      const ids = hits.map((h) => h.id);
      const henry = hits.find(
        (h) =>
          h.voice === "Matthew Henry" &&
          (h.books?.includes(bookId) ?? false) &&
          (h.chapters?.includes(1) ?? false),
      );
      if (!henry) missingHenry.push(`${bookId}:${ids.join(",") || "(none)"}`);
      if (!CALVIN_SKIP.has(bookId)) {
        const calvin = hits.find(
          (h) =>
            h.voice === "John Calvin" &&
            (h.books?.includes(bookId) ?? false) &&
            (h.chapters?.includes(1) ?? false),
        );
        if (!calvin) missingCalvin.push(`${bookId}:${ids.join(",") || "(none)"}`);
      }
    }
    assert.equal(
      missingHenry.length,
      0,
      `Henry ch.1 missing for ${missingHenry.length}/27: ${missingHenry.join("; ")}`,
    );
    assert.equal(
      missingCalvin.length,
      0,
      `Calvin ch.1 missing for ${missingCalvin.length} (except 2JN/3JN/REV): ${missingCalvin.join("; ")}`,
    );
  });

  it("maps Rev 1:1 servant-John verse to henry-revelation-1, never a JHN-only stack", () => {
    const verseText = NT_V1.REV;
    assert.match(verseText, /John/);
    const hits = mapCatalog({
      question: "",
      bookId: "REV",
      chapter: 1,
      verseText,
    });
    const ids = hits.map((h) => h.id);
    assert.ok(
      hits.some((h) => h.id === "henry-revelation-1" || (h.voice === "Matthew Henry" && h.books?.includes("REV") && h.chapters?.includes(1))),
      `expected henry-revelation-1 (Rev ch.1 Henry), got ${ids.join(",")}`,
    );
    const onlyGospelJohn =
      hits.length > 0 &&
      hits.every((h) => (h.books ?? []).includes("JHN") && !(h.books ?? []).includes("REV"));
    assert.equal(onlyGospelJohn, false, `Rev 1:1 must not be a JHN-only stack, got ${ids.join(",")}`);
  });

  it("does not let Gospel of John pages steal 1JN / 2JN / 3JN", () => {
    const cases = [
      { bookId: "1JN" as const, henryId: "henry-1john-1" },
      { bookId: "2JN" as const, henryId: "henry-2john-1" },
      { bookId: "3JN" as const, henryId: "henry-3john-1" },
    ];
    for (const c of cases) {
      const hits = mapCatalog({
        question: "",
        bookId: c.bookId,
        chapter: 1,
        verseText: NT_V1[c.bookId],
      });
      const ids = hits.map((h) => h.id);
      assert.ok(ids.includes(c.henryId), `expected ${c.henryId}, got ${ids.join(",")}`);
      for (const drown of GOSPEL_JOHN_IDS) {
        assert.equal(
          ids.includes(drown),
          false,
          `${drown} must not appear for ${c.bookId} (wrong-book score 0), got ${ids.join(",")}`,
        );
      }
    }
  });

  it("scores wrong-book chapter pages at 0", () => {
    const calvinJohn = CATALOG.find((e) => e.id === "calvin-john-1");
    assert.ok(calvinJohn);
    const tokens = tokenize("john word beginning servant revelation life");
    assert.equal(scoreEntry(calvinJohn, tokens, "REV", 1), 0);
    assert.equal(scoreEntry(calvinJohn, tokens, "1JN", 1), 0);
    assert.ok(scoreEntry(calvinJohn, tokens, "JHN", 1) > 0);
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

  it("keeps the page extract when verse tokens miss", () => {
    const html = `<p>Paul writes to the saints at Colossae concerning the preeminence of the Son and the fullness that dwells in him bodily, which the church receives as her head.</p>`;
    const paras = pickParagraphs(paragraphsFromHtml(html), "philosophy empty deceit");
    assert.equal(paras.length, 1);
    assert.ok(paras[0].toLowerCase().includes("colossae"));
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

describe("matthew reception desk", () => {
  it("provides Patristic, Scholastic, and Reformed sources for Matthew", async () => {
    const { RECEPTION_SOURCES } = await import("./catalog.ts");
    const matSources = RECEPTION_SOURCES.filter((s) => s.coverage.book === "MAT");
    assert.ok(matSources.length >= 4, `found ${matSources.length} Matthew sources`);

    const eras = new Set(matSources.map((s) => s.era));
    assert.ok(eras.has("patristic"));
    assert.ok(eras.has("medieval"));
    assert.ok(eras.has("reformation"));
    assert.ok(eras.has("puritan"));
  });

  it("serves curated cards for Matthew pericopes with distinct traditions", async () => {
    const { getCurated, CURATED_ENTRIES } = await import("./curated.ts");
    assert.ok(CURATED_ENTRIES.length > 0);

    const mat1 = getCurated("MAT", 1, 21);
    assert.ok(mat1 && mat1.cards.length >= 3);
    const mat1Traditions = new Set(mat1.cards.map((c) => c.tradition));
    assert.ok(mat1Traditions.has("eastern-patristic"));
    assert.ok(mat1Traditions.has("reformed"));
    assert.ok(mat1Traditions.has("puritan"));

    const mat5 = getCurated("MAT", 5, 3);
    assert.ok(mat5 && mat5.cards.length >= 4);

    const mat16 = getCurated("MAT", 16, 18);
    assert.ok(mat16 && mat16.cards.length >= 4);
    const mat16Voices = mat16.cards.map((c) => c.voice);
    assert.ok(mat16Voices.includes("John Chrysostom"));
    assert.ok(mat16Voices.includes("Thomas Aquinas"));
    assert.ok(mat16Voices.includes("John Calvin"));
    assert.ok(mat16Voices.includes("Matthew Poole"));

    const mat28 = getCurated("MAT", 28, 19);
    assert.ok(mat28 && mat28.cards.length >= 3);
  });
});

