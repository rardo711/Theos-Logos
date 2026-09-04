import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CATALOG, mapCatalog, scoreEntry, tokenize } from "./catalog.ts";
import {
  htmlToText,
  paragraphsFromHtml,
  pickParagraphs,
  pickVerseParagraphs,
  paragraphMentionsVerse,
  parseRetrieved,
  validateReceptionOutput,
} from "./retrieve.ts";

describe("primary-source mapping", () => {
  it("indexes a broad primary-source set with unique ids", () => {
    assert.ok(CATALOG.length >= 60, `catalog is ${CATALOG.length}`);
    const ids = CATALOG.map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("never indexes one page under two ids", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    const byUrl = new Map<string, string[]>();
    for (const row of CATALOG) {
      byUrl.set(row.url, [...(byUrl.get(row.url) ?? []), row.id]);
    }
    const dupes = [...byUrl.entries()].filter(([, ids]) => ids.length > 1);
    assert.deepEqual(
      dupes.map(([url, ids]) => `${url} <- ${ids.join(", ")}`),
      [],
      "one page per row: a duplicate URL burns a fetch slot on a page already read",
    );
  });

  it("never indexes a volume index or title page", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    // These shapes are tables of contents, not commentary on any verse.
    const INDEX_PAGE = [
      /\/schaff\/npnf\d+\.html$/,
      /\/aquinas\/catena\d+\.html$/,
      /\/poole\/annotations\.html$/,
      /\/calcom\d+\/calcom\d+\.i\.html$/,
      /\/luther\/good_works\//,
    ];
    const offenders = CATALOG.filter((row) =>
      INDEX_PAGE.some((re) => re.test(row.url)),
    ).map((row) => `${row.id} -> ${row.url}`);
    assert.deepEqual(offenders, []);
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

describe("romans reception desk", () => {
  it("covers every chapter of Romans 1-11 with named traditions", async () => {
    const { CURATED_ENTRIES } = await import("./curated.ts");
    const rom = CURATED_ENTRIES.filter((e) => e.verseRef.startsWith("ROM."));
    const chapters = new Set(rom.map((e) => Number(e.verseRef.split(".")[1])));
    for (let ch = 1; ch <= 11; ch++) {
      assert.ok(chapters.has(ch), `Romans ${ch} has no curated entry`);
    }
  });

  it("gives Romans 9:11 four traditions, not one verdict", async () => {
    const { getCurated } = await import("./curated.ts");
    const result = getCurated("ROM", 9, 11);
    assert.ok(result, "Romans 9:11 must have curated cards");
    const traditions = new Set(result.cards.map((c) => c.tradition));
    assert.ok(traditions.has("western-patristic"), "Augustine");
    assert.ok(traditions.has("eastern-patristic"), "Chrysostom");
    assert.ok(traditions.has("reformed"), "Calvin");
    assert.ok(traditions.has("scholastic"), "Aquinas");
  });

  it("resolves a verse inside a pericope to its canonical entry", async () => {
    const { getCurated } = await import("./curated.ts");
    const canonical = getCurated("ROM", 9, 11);
    const neighbour = getCurated("ROM", 9, 13);
    assert.ok(neighbour, "Romans 9:13 should fall back to the pericope");
    assert.equal(neighbour.cards.length, canonical?.cards.length);
  });

  it("marks composed excerpts as paraphrase and links no volume index", async () => {
    const { CURATED_ENTRIES, curatedEntryToCard } = await import("./curated.ts");
    const verbatimClaims = CURATED_ENTRIES.filter(
      (e) => curatedEntryToCard(e).paraphrased === false,
    );
    assert.deepEqual(
      verbatimClaims.map((e) => e.verseRef),
      [],
      "a curated excerpt may claim verbatim only when transcribed from the page",
    );
    const INDEX_PAGE = [
      /\/schaff\/npnf\d+\.html$/,
      /\/aquinas\/catena\d+\.html$/,
      /\/poole\/annotations\.html$/,
      /\/calcom\d+\/calcom\d+\.i\.html$/,
      /\/luther\/good_works\//,
    ];
    const badLinks = CURATED_ENTRIES.filter(
      (e) => e.url && INDEX_PAGE.some((re) => re.test(e.url!)),
    ).map((e) => `${e.verseRef} -> ${e.url}`);
    assert.deepEqual(badLinks, []);
  });
});

describe("verse-scoped catalog rows", () => {
  it("drops a pericope page that does not reach the verse", () => {
    const pericope = {
      id: "calvin-rom-9-1",
      voice: "John Calvin",
      work: "Commentary on Romans",
      tradition: "reformed" as const,
      locus: "Romans 9:1-5",
      url: "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.i.html",
      tags: ["romans", "calvin"],
      books: ["ROM"],
      chapters: [9],
      verses: [1, 5] as [number, number],
    };
    const tokens = tokenize("election purpose romans");
    assert.ok(scoreEntry(pericope, tokens, "ROM", 9, [], 4) > 0, "verse 4 is on this page");
    assert.equal(scoreEntry(pericope, tokens, "ROM", 9, [], 11), 0, "verse 11 is not");
    assert.ok(scoreEntry(pericope, tokens, "ROM", 9, [], null) > 0, "no verse: chapter rules apply");
  });

  it("leaves chapter-level rows alone", () => {
    const chapterPage = {
      id: "henry-romans-9",
      voice: "Matthew Henry",
      work: "Commentary on the Whole Bible",
      tradition: "reformed" as const,
      locus: "Romans 9",
      url: "https://ccel.org/ccel/henry/mhc6/mhc6.Rom.x.html",
      tags: ["romans", "henry"],
      books: ["ROM"],
      chapters: [9],
    };
    const tokens = tokenize("election romans");
    assert.ok(scoreEntry(chapterPage, tokens, "ROM", 9, [], 11) > 0);
  });
});

describe("New Testament coverage floor", () => {
  const MID_CHAPTER: Array<[string, number]> = [
    ["MAT", 5], ["MRK", 10], ["LUK", 15], ["JHN", 6], ["ACT", 17], ["ROM", 9],
    ["1CO", 13], ["2CO", 5], ["GAL", 3], ["EPH", 2], ["PHP", 2], ["COL", 2],
    ["1TH", 4], ["2TH", 2], ["1TI", 2], ["2TI", 3], ["TIT", 2], ["PHM", 1],
    ["HEB", 11], ["JAS", 2], ["1PE", 2], ["2PE", 3], ["1JN", 4], ["2JN", 1],
    ["3JN", 1], ["JUD", 1], ["REV", 20],
  ];

  it("maps every NT book to at least three same-book pages mid-book", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    const thin: string[] = [];
    for (const [bookId, chapter] of MID_CHAPTER) {
      const hits = mapCatalog({
        question: "",
        bookId,
        chapter,
        verse: 1,
        verseText: "",
        mode: "reception",
        limit: 7,
      });
      const sameBook = hits.filter((h) => (h.books ?? []).includes(bookId));
      if (sameBook.length < 3) {
        thin.push(`${bookId} ${chapter}: ${sameBook.length} (${hits.map((h) => h.id).join(", ")})`);
      }
    }
    assert.deepEqual(thin, []);
  });
});

describe("verse-anchored paragraph selection", () => {
  const VERSE_4 =
    "4. Who are Israelites, etc. Here the reason is now more plainly given, why the destruction of that people caused him so much anguish, namely because they were Israelites.";
  const VERSE_11 =
    "11. For the children being not yet born, neither having done any good or evil. The Apostle shows that the election of God is free, and depends on his calling alone, not on works.";
  const UNRELATED =
    "The Apostle here anticipates an objection, and the anguish of his mind is such that he would gladly be accursed for the sake of his kindred according to the flesh.";

  it("recognises the lemma shapes these hosts actually print", () => {
    assert.equal(paragraphMentionsVerse("11. For the children", 9, 11), true);
    assert.equal(paragraphMentionsVerse("Ver. 11. Though they", 9, 11), true);
    assert.equal(paragraphMentionsVerse("Verses 9-13 treat election", 9, 11), true);
    assert.equal(paragraphMentionsVerse("See Romans 9:11 on this", 9, 11), true);
    assert.equal(paragraphMentionsVerse("Romans 9:6-13 is one argument", 9, 11), true);
    assert.equal(paragraphMentionsVerse("4. Who are Israelites", 9, 11), false);
    assert.equal(paragraphMentionsVerse("111 is not a verse here", 9, 11), false);
  });

  it("puts the target verse ahead of a word-similar neighbour", () => {
    const picked = pickVerseParagraphs(
      [VERSE_4, UNRELATED, VERSE_11],
      9,
      11,
      "though they were not yet born purpose of election",
      2,
    );
    assert.equal(picked[0], VERSE_11, "verse 11 lemma must rank first");
  });

  it("falls back to token scoring when no paragraph names the verse", () => {
    const picked = pickVerseParagraphs(
      [VERSE_4, UNRELATED],
      9,
      11,
      "Israelites anguish",
      2,
    );
    assert.ok(picked.length > 0);
  });

  it("behaves like pickParagraphs when no verse is supplied", () => {
    const paras = [VERSE_4, VERSE_11, UNRELATED];
    assert.deepEqual(
      pickVerseParagraphs(paras, undefined, undefined, "election", 2),
      pickParagraphs(paras, "election", 2),
    );
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

describe("mark reception desk", () => {
  it("provides Scholastic and Reformed sources for Mark", async () => {
    const { RECEPTION_SOURCES } = await import("./catalog.ts");
    const mrkSources = RECEPTION_SOURCES.filter((s) => s.coverage.book === "MRK");
    assert.ok(mrkSources.length >= 3, `found ${mrkSources.length} Mark sources`);

    const ids = new Set(mrkSources.map((s) => s.id));
    assert.ok(ids.has("aquinas-catena-mark"));
    assert.ok(ids.has("calvin-mark"));
    assert.ok(ids.has("poole-mark"));

    const eras = new Set(mrkSources.map((s) => s.era));
    assert.ok(eras.has("medieval"));
    assert.ok(eras.has("reformation"));
    assert.ok(eras.has("puritan"));
  });

  it("serves curated cards for Mark pericopes (10:45 ransom, 15:34 cry of dereliction)", async () => {
    const { getCurated } = await import("./curated.ts");

    const mrk10 = getCurated("MRK", 10, 45);
    assert.ok(mrk10 && mrk10.cards.length >= 3);
    const mrk10Voices = mrk10.cards.map((c) => c.voice);
    assert.ok(mrk10Voices.includes("Thomas Aquinas"));
    assert.ok(mrk10Voices.includes("John Calvin"));
    assert.ok(mrk10Voices.includes("Matthew Poole"));

    const mrk15 = getCurated("MRK", 15, 34);
    assert.ok(mrk15 && mrk15.cards.length >= 3);
    const mrk15Voices = mrk15.cards.map((c) => c.voice);
    assert.ok(mrk15Voices.includes("John Calvin"));
    assert.ok(mrk15Voices.includes("Thomas Aquinas"));
  });
});

describe("luke reception desk", () => {
  it("provides Patristic, Scholastic, and Reformed sources for Luke", async () => {
    const { RECEPTION_SOURCES } = await import("./catalog.ts");
    const lukSources = RECEPTION_SOURCES.filter((s) => s.coverage.book === "LUK");
    assert.ok(lukSources.length >= 6, `found ${lukSources.length} Luke sources`);

    const ids = new Set(lukSources.map((s) => s.id));
    assert.ok(ids.has("cyril-luke"));
    assert.ok(ids.has("ambrose-luke"));
    assert.ok(ids.has("aquinas-catena-luke"));
    assert.ok(ids.has("calvin-luke"));
    assert.ok(ids.has("luther-magnificat"));
    assert.ok(ids.has("poole-luke"));

    const eras = new Set(lukSources.map((s) => s.era));
    assert.ok(eras.has("patristic"));
    assert.ok(eras.has("medieval"));
    assert.ok(eras.has("reformation"));
    assert.ok(eras.has("puritan"));
  });

  it("serves curated cards for Luke pericopes (Magnificat, Tax Collector, Penitent Thief)", async () => {
    const { getCurated } = await import("./curated.ts");

    // Magnificat
    const luk1_46 = getCurated("LUK", 1, 46);
    assert.ok(luk1_46 && luk1_46.cards.length >= 2);
    const luk1_48 = getCurated("LUK", 1, 48);
    assert.ok(luk1_48 && luk1_48.cards.length >= 2);
    const luk1Voices = [...(luk1_46?.cards ?? []), ...(luk1_48?.cards ?? [])].map((c) => c.voice);
    assert.ok(luk1Voices.includes("Ambrose of Milan"));
    assert.ok(luk1Voices.includes("Martin Luther"));
    assert.ok(luk1Voices.includes("John Calvin"));

    // Pharisee and Tax Collector
    const luk18_13 = getCurated("LUK", 18, 13);
    assert.ok(luk18_13 && luk18_13.cards.length >= 2);
    const luk18_14 = getCurated("LUK", 18, 14);
    assert.ok(luk18_14 && luk18_14.cards.length >= 2);
    const luk18Voices = [...(luk18_13?.cards ?? []), ...(luk18_14?.cards ?? [])].map((c) => c.voice);
    assert.ok(luk18Voices.includes("Cyril of Alexandria"));
    assert.ok(luk18Voices.includes("John Calvin"));
    assert.ok(luk18Voices.includes("Thomas Aquinas"));

    // Penitent Thief
    const luk23_42 = getCurated("LUK", 23, 42);
    assert.ok(luk23_42 && luk23_42.cards.length >= 1);
    const luk23_43 = getCurated("LUK", 23, 43);
    assert.ok(luk23_43 && luk23_43.cards.length >= 2);
    const luk23Voices = [...(luk23_42?.cards ?? []), ...(luk23_43?.cards ?? [])].map((c) => c.voice);
    assert.ok(luk23Voices.includes("Thomas Aquinas"));
    assert.ok(luk23Voices.includes("John Calvin"));
    assert.ok(luk23Voices.includes("Ambrose of Milan"));
  });
});

describe("john reception desk", () => {
  it("provides Patristic, Scholastic, and Reformed sources for John", async () => {
    const { RECEPTION_SOURCES } = await import("./catalog.ts");
    const jhnSources = RECEPTION_SOURCES.filter((s) => s.coverage.book === "JHN");
    assert.ok(jhnSources.length >= 6, `found ${jhnSources.length} John sources`);

    const ids = new Set(jhnSources.map((s) => s.id));
    assert.ok(ids.has("chrysostom-john"));
    assert.ok(ids.has("augustine-john"));
    assert.ok(ids.has("aquinas-catena-john"));
    assert.ok(ids.has("calvin-john"));
    assert.ok(ids.has("luther-john"));
    assert.ok(ids.has("poole-john"));

    const eras = new Set(jhnSources.map((s) => s.era));
    assert.ok(eras.has("patristic"));
    assert.ok(eras.has("medieval"));
    assert.ok(eras.has("reformation"));
    assert.ok(eras.has("puritan"));
  });

  it("serves curated cards for John iconic pericopes (1:1, 6:44, 14:6, 19:30)", async () => {
    const { getCurated } = await import("./curated.ts");

    // John 1:1
    const jhn1 = getCurated("JHN", 1, 1);
    assert.ok(jhn1 && jhn1.cards.length >= 4);
    const jhn1Voices = jhn1.cards.map((c) => c.voice);
    assert.ok(jhn1Voices.includes("John Chrysostom"));
    assert.ok(jhn1Voices.includes("Augustine") || jhn1Voices.includes("Augustine of Hippo"));
    assert.ok(jhn1Voices.includes("John Calvin"));

    // John 6:44
    const jhn6 = getCurated("JHN", 6, 44);
    assert.ok(jhn6 && jhn6.cards.length >= 3);
    const jhn6Voices = jhn6.cards.map((c) => c.voice);
    assert.ok(jhn6Voices.includes("Augustine of Hippo"));
    assert.ok(jhn6Voices.includes("John Calvin"));
    assert.ok(jhn6Voices.includes("Thomas Aquinas"));

    // John 14:6
    const jhn14 = getCurated("JHN", 14, 6);
    assert.ok(jhn14 && jhn14.cards.length >= 3);
    const jhn14Voices = jhn14.cards.map((c) => c.voice);
    assert.ok(jhn14Voices.includes("Thomas Aquinas"));
    assert.ok(jhn14Voices.includes("John Calvin"));
    assert.ok(jhn14Voices.includes("Augustine of Hippo"));

    // John 19:30
    const jhn19 = getCurated("JHN", 19, 30);
    assert.ok(jhn19 && jhn19.cards.length >= 3);
    const jhn19Voices = jhn19.cards.map((c) => c.voice);
    assert.ok(jhn19Voices.includes("John Calvin"));
    assert.ok(jhn19Voices.includes("Augustine of Hippo"));
    assert.ok(jhn19Voices.includes("Thomas Aquinas"));
  });
});

describe("removing generated source cards", () => {
  it("distinguishes generated cards from curated desk cards", async () => {
    const { isCardGenerated } = await import("./notes.ts");
    const { getCurated } = await import("./curated.ts");

    const genCard = {
      voice: "Unknown Commentator",
      citation: "Random Citation",
      work: "Random Work",
      quote: "Some generated quote",
      tradition: "reformed" as const,
      source: "generated" as const,
    };
    assert.equal(isCardGenerated(genCard, "MAT", 1, 21), true);

    const mat1 = getCurated("MAT", 1, 21);
    assert.ok(mat1 && mat1.cards.length > 0);
    assert.equal(isCardGenerated(mat1.cards[0], "MAT", 1, 21), false);
  });
});

describe("systemic boilerplate and landing page rejection", () => {
  it("rejects digital library headers, landing chrome, and promotional banners", async () => {
    const { isBoilerplate, isSubstantiveQuote } = await import("./retrieve.ts");

    const badExamples = [
      "Work info: Commentary on John - Volume 1 - Christian Classics Ethereal Library",
      "Martin Luther: Assorted Sermons By Martin Luther - Christian Classics Ethereal Library",
      "Please help support the mission of New Advent and get the full contents of this website as an instant download. Includes the Catholic Encyclopedia, Church Fathers, Summa, Bible and more.",
      "Home | Browse Titles | Browse Authors | Search | Library Info",
      "Christian Classics Ethereal Library - CCEL Reader width: 800px Text size: 14pt",
      "Disable scripture popups | Bible version: KJV",
      "The following sermon is taken from volume 3 of the church postil.",
    ];

    for (const bad of badExamples) {
      assert.equal(isBoilerplate(bad), true, `Expected boilerplate for: "${bad}"`);
      assert.equal(isSubstantiveQuote(bad), false, `Expected not substantive for: "${bad}"`);
    }

    const goodQuotes = [
      "The Word was not made.",
      "The good shepherd gives His life for the sheep. Through Christ the Mediator we are brought unto the Father.",
      "By this word Christ testifies that the whole work of our redemption is fulfilled and consummated.",
      "Christ calls Himself the Good Shepherd because He does not drive the sheep with threats or demands of the law, but gives His own life for them.",
    ];

    for (const good of goodQuotes) {
      assert.equal(isBoilerplate(good), false, `Expected clean quote for: "${good}"`);
      assert.equal(isSubstantiveQuote(good), true, `Expected substantive quote for: "${good}"`);
    }
  });

  it("serves curated cards for John 10:11 Good Shepherd with substantive historical sources", async () => {
    const { getCurated } = await import("./curated.ts");
    const jhn10 = getCurated("JHN", 10, 11);
    assert.ok(jhn10 && jhn10.cards.length >= 4);

    const voices = jhn10.cards.map((c) => c.voice);
    assert.ok(voices.includes("Augustine of Hippo"));
    assert.ok(voices.includes("John Calvin"));
    assert.ok(voices.includes("Martin Luther"));
    assert.ok(voices.includes("Matthew Henry"));

    for (const card of jhn10.cards) {
      assert.ok(!card.quote.includes("Christian Classics Ethereal Library"));
      assert.ok(!card.quote.includes("Work info:"));
      assert.ok(!card.quote.includes("New Advent"));
      assert.ok(card.quote.length > 50);
    }
  });

  it("enforces chapter boundaries in catalog mapping so wrong-chapter entries never leak", async () => {
    const { mapCatalog } = await import("./catalog.ts");
    const results = mapCatalog({
      question: "good shepherd gives his life",
      bookId: "JHN",
      chapter: 10,
    });

    assert.ok(results.length > 0);
    for (const r of results) {
      if (r.chapters?.length) {
        assert.ok(
          r.chapters.includes(10),
          `Entry ${r.id} restricted to chapters ${r.chapters.join(", ")} matched chapter 10!`,
        );
      }
    }
  });

  it("filters embedded scripture blocks and truncates quotes at sentence boundaries", async () => {
    const { isEmbeddedScripture, truncateAtSentence } = await import("./retrieve.ts");

    const rawScriptureBlock =
      "33 When Jesus therefore saw her weeping, and the Jews also weeping which came with her, he groaned in the spirit, and was troubled, 34 And said, Where have ye laid him? They said unto him, Lord, come and see. 35 Jesus wept. 36 Then said the Jews, Behold how he loved him!";
    assert.equal(isEmbeddedScripture(rawScriptureBlock), true);

    const actualCommentary =
      "(1.) As he was going to the grave, as if he had been following the corpse thither, Jesus wept, v. 35. A very short verse, but it affords many useful instructions: [1.] That Jesus Christ was really and truly man, and partook of the flesh and blood of the children.";
    assert.equal(isEmbeddedScripture(actualCommentary), false);

    const multiSentence =
      "Christ did indeed weep, but it was because He willed to weep. He troubled Himself, because He had the power to be troubled or not to be troubled. He wept to teach men to weep with them that weep, and to show the reality of the human nature He had assumed.";
    const truncated = truncateAtSentence(multiSentence, 150);
    assert.ok(truncated.endsWith("."));
    assert.ok(!truncated.includes("…"));
    assert.equal(
      truncated,
      "Christ did indeed weep, but it was because He willed to weep. He troubled Himself, because He had the power to be troubled or not to be troubled.",
    );
  });

  it("serves curated cards for John 11:35 Jesus Wept with pericope range mapping", async () => {
    const { getCurated, getCuratedCardsForVerse } = await import("./curated.ts");
    const desk = getCurated("JHN", 11, 35);
    assert.ok(desk && desk.cards.length >= 4);

    const voices = desk.cards.map((c) => c.voice);
    assert.ok(voices.includes("Augustine of Hippo"));
    assert.ok(voices.includes("John Calvin"));
    assert.ok(voices.includes("Matthew Henry"));
    assert.ok(voices.includes("Cyril of Alexandria"));

    // Check pericope mapping for neighboring verses in John 11:32-37
    const pericopeCards = getCuratedCardsForVerse("JHN", 11, 33);
    assert.equal(pericopeCards.length, desk.cards.length);
  });

  it("does not match whole-book introductory arguments for mid-book chapter queries", async () => {
    const { mapCatalog } = await import("./catalog.ts");
    const results = mapCatalog({
      question: "Why did Jesus weep?",
      bookId: "JHN",
      chapter: 11,
      verseText: "Jesus wept.",
    });

    for (const r of results) {
      assert.ok(
        r.locus.toLowerCase() !== "argument",
        `Argument entry ${r.id} leaked into mid-book chapter query!`,
      );
    }
  });

  it("verifies validateReceptionOutput enforces strict deterministic substring matching", () => {
    const chunk = "It is not therefore of him that willeth, nor of him that runneth, but of God that showeth mercy; not because man cannot will and run, but because God prepares the will.";
    
    // Exact match
    assert.equal(
      validateReceptionOutput(
        { status: "valid", quote: "It is not therefore of him that willeth, nor of him that runneth, but of God that showeth mercy" },
        chunk,
      ),
      true,
    );

    // Ellipsis bridge
    assert.equal(
      validateReceptionOutput(
        { status: "valid", quote: "It is not therefore of him that willeth... but of God that showeth mercy" },
        chunk,
      ),
      true,
    );

    // Rejection when status is rejected
    assert.equal(
      validateReceptionOutput(
        { status: "rejected", quote: "It is not therefore of him that willeth" },
        chunk,
      ),
      false,
    );

    // Rejection when quote is hallucinated/not in chunk (e.g. from James 1 or other sources)
    assert.equal(
      validateReceptionOutput(
        { status: "valid", quote: "Let no man say when he is tempted, I am tempted of God" },
        chunk,
      ),
      false,
    );
  });

  it("parses retrieved response and filters hallucinated extracts with parseRetrieved", () => {
    const mockExtracts = [
      {
        entry: {
          id: "augustine-enchiridion-rom9",
          voice: "Augustine",
          work: "Enchiridion",
          tradition: "patristic" as const,
          locus: "Enchiridion 98",
          url: "https://www.newadvent.org/fathers/1302.htm",
          tags: ["election"],
        },
        url: "https://www.newadvent.org/fathers/1302.htm",
        paragraphs: [
          "It is not therefore of him that willeth, nor of him that runneth, but of God that showeth mercy; not because man cannot will and run, but because God prepares the will and grants the strength.",
        ],
      },
    ];

    const modelResponseWithHallucination = JSON.stringify({
      cards: [
        {
          status: "valid",
          voice: "Augustine",
          work: "Enchiridion",
          tradition: "patristic",
          quote: "It is not therefore of him that willeth, nor of him that runneth, but of God that showeth mercy.",
          context_bridge: "Augustine explains that human willing is prepared and sustained by divine mercy.",
          citation: "Enchiridion 98",
          url: "https://www.newadvent.org/fathers/1302.htm",
        },
        {
          status: "valid",
          voice: "Augustine",
          work: "On Grace and Free Will",
          tradition: "patristic",
          quote: "Let no man say when he is tempted, I am tempted of God: for God cannot be tempted with evil.",
          context_bridge: "Augustine addresses free will citing James 1.",
          citation: "De gratia 2",
          url: "https://www.newadvent.org/fathers/1503.htm",
        },
        {
          status: "rejected",
          rejection_reason: "Irrelevant cross-reference",
          voice: "Pelagius",
          quote: "Man is able to do all good by free choice.",
          citation: "Letter to Demetrias",
        },
      ],
      caution: "Verified public extract.",
    });

    const parsedCards = parseRetrieved(modelResponseWithHallucination, mockExtracts);
    // Only the genuine grounded quote from Enchiridion 98 should pass; the James quote and rejected quote are filtered
    assert.equal(parsedCards.length, 1);
    assert.equal(parsedCards[0].voice, "Augustine");
    assert.equal(parsedCards[0].work, "Enchiridion");
    assert.equal(parsedCards[0].grounded, true);
    assert.ok(parsedCards[0].contextBridge?.includes("divine mercy"));
  });

  it("isolates Romans 9:16 from topical unbooked treatises like De gratia et libero arbitrio", () => {
    const hits = mapCatalog({
      question: "",
      bookId: "ROM",
      chapter: 9,
      verseText: "So then it depends not on human will or exertion, but on God, who has mercy.",
    });

    const ids = hits.map((h) => h.id);
    assert.ok(!ids.includes("augustine-grace-freewill"), "augustine-grace-freewill must NOT match Romans 9!");
    assert.ok(ids.includes("chrysostom-rom-h16"), "Must match Chrysostom Homily 16 on Romans 9");
    assert.ok(ids.includes("augustine-enchiridion-rom9"), "Must match Augustine Enchiridion 98 on Romans 9:16");
    assert.ok(ids.includes("calvin-rom-9"), "Must match Calvin Romans 9");
    assert.ok(ids.includes("henry-romans-9"), "Must match Matthew Henry Romans 9");
  });

  it("serves verified historical curated cards for Romans 9:16", async () => {
    const { getCurated } = await import("./curated.ts");
    const desk = getCurated("ROM", 9, 16);
    assert.ok(desk && desk.cards.length >= 4);

    const voices = desk.cards.map((c) => c.voice);
    assert.ok(voices.includes("Augustine"));
    assert.ok(voices.includes("John Chrysostom"));
    assert.ok(voices.includes("John Calvin"));
    assert.ok(voices.includes("Matthew Henry"));
  });
});

