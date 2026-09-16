import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CATALOG, mapCatalog, scoreEntry, tokenize } from "./catalog.ts";
import {
  htmlToText,
  paragraphsFromHtml,
  pickParagraphs,
  pickVerseParagraphs,
  paragraphMentionsVerse,
  paragraphTreatsVerse,
  isSubstantiveQuote,
  parseRetrieved,
  byteCapFor,
  ensureReservedCards,
  validateReceptionOutput,
  verseTrueLocus,
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

  it("empty Inquire limit 9 on Rom 8 / Matt 5 / John 3 includes Gill, Geneva, AND Lange", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    const beatitude =
      "Blessed are the poor in spirit: for theirs is the kingdom of heaven";
    const cases = [
      {
        bookId: "ROM" as const,
        chapter: 8,
        verse: 28 as number | undefined,
        verseText: "And we know that all things work together for good",
      },
      {
        bookId: "MAT" as const,
        chapter: 5,
        verse: 3 as number | undefined,
        verseText: beatitude,
      },
      {
        bookId: "JHN" as const,
        chapter: 3,
        verse: 16 as number | undefined,
        verseText: "For God so loved the world, that he gave his only begotten Son",
      },
    ];
    for (const c of cases) {
      const hits = mapCatalog({
        question: "",
        bookId: c.bookId,
        chapter: c.chapter,
        verse: c.verse,
        verseText: c.verseText,
        limit: 9,
      });
      const ids = hits.map((h) => h.id);
      for (const prefix of ["gill-", "geneva-", "lange-"] as const) {
        assert.ok(
          ids.some(
            (id) =>
              id.startsWith(prefix) &&
              hits.some(
                (h) =>
                  h.id === id &&
                  (h.books?.includes(c.bookId) ?? false) &&
                  (h.chapters?.includes(c.chapter) ?? false),
              ),
          ),
          `expected ${prefix}* for ${c.bookId} ${c.chapter}, got ${ids.join(",")}`,
        );
      }
    }
  });

  it("empty Inquire limit 9 seats wave-2 voices on Matt 5 / Rom 8 / John 3", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    const WAVE2 = ["barnes-", "maclaren-", "vws-", "hawker-", "trapp-", "burkitt-"] as const;
    const cases = [
      {
        bookId: "MAT" as const,
        chapter: 5,
        verse: 3 as number | undefined,
        verseText:
          "Blessed are the poor in spirit: for theirs is the kingdom of heaven",
      },
      {
        bookId: "ROM" as const,
        chapter: 8,
        verse: 28 as number | undefined,
        verseText: "And we know that all things work together for good",
      },
      {
        bookId: "JHN" as const,
        chapter: 3,
        verse: 16 as number | undefined,
        verseText: "For God so loved the world, that he gave his only begotten Son",
      },
    ];
    const distinct = new Set<string>();
    for (const c of cases) {
      const hits = mapCatalog({
        question: "",
        bookId: c.bookId,
        chapter: c.chapter,
        verse: c.verse,
        verseText: c.verseText,
        limit: 9,
      });
      const ids = hits.map((h) => h.id);
      for (const prefix of ["gill-", "geneva-", "lange-"] as const) {
        assert.ok(
          ids.some((id) => id.startsWith(prefix)),
          `expected ${prefix}* alongside wave-2 for ${c.bookId} ${c.chapter}, got ${ids.join(",")}`,
        );
      }
      const wave2Hits = ids.filter((id) => WAVE2.some((p) => id.startsWith(p)));
      assert.ok(
        wave2Hits.length >= 1,
        `expected >=1 wave-2 id for ${c.bookId} ${c.chapter}, got ${ids.join(",")}`,
      );
      for (const id of wave2Hits) distinct.add(id.split("-")[0]!);
    }
    assert.ok(
      distinct.size >= 3,
      `expected >=3 distinct wave-2 voices across sample verses, got ${[...distinct].join(",")}`,
    );
  });

  it("Gill and Geneva chapter pages keep sacred-texts primary with BibleHub altUrl", () => {
    const gill = CATALOG.find((e) => e.id === "gill-matthew-5");
    const geneva = CATALOG.find((e) => e.id === "geneva-matthew-5");
    assert.ok(gill && geneva);
    assert.match(gill.url, /archive\.sacred-texts\.com\/bib\/cmt\/gill\//);
    assert.match(geneva.url, /archive\.sacred-texts\.com\/bib\/cmt\/geneva\//);
    assert.equal(gill.altUrl, "https://biblehub.com/commentaries/gill/matthew/5.htm");
    assert.equal(geneva.altUrl, "https://biblehub.com/commentaries/gsb/matthew/5.htm");
  });

  it("scores Gill/Geneva same-book > 0 and wrong-book Gill at 0", () => {
    const gillRom = CATALOG.find((e) => e.id === "gill-romans-8");
    const genevaRom = CATALOG.find((e) => e.id === "geneva-romans-8");
    const gillJohn = CATALOG.find((e) => e.id.startsWith("gill-john-"));
    assert.ok(gillRom, "gill-romans-8 in CATALOG");
    assert.ok(genevaRom, "geneva-romans-8 in CATALOG");
    assert.ok(gillJohn, "gill-john-* in CATALOG");
    const tokens = tokenize("spirit adoption sons heirs");
    assert.ok(scoreEntry(gillRom, tokens, "ROM", 8) > 0);
    assert.ok(scoreEntry(genevaRom, tokens, "ROM", 8) > 0);
    assert.equal(scoreEntry(gillJohn, tokens, "ROM", 8), 0);
  });

  it("indexes wave2 Hub + bibliaplus chapter pages and no Scofield", () => {
    const chapters = [
      { bookId: "MAT" as const, chapter: 5, stem: "matthew" },
      { bookId: "ROM" as const, chapter: 8, stem: "romans" },
      { bookId: "JHN" as const, chapter: 3, stem: "john" },
    ];
    for (const c of chapters) {
      for (const prefix of ["barnes", "maclaren", "vws", "hawker", "trapp", "burkitt"] as const) {
        const id = `${prefix}-${c.stem}-${c.chapter}`;
        const row = CATALOG.find((e) => e.id === id);
        assert.ok(row, `${id} in CATALOG`);
        assert.ok(row.books?.includes(c.bookId));
        assert.ok(row.chapters?.includes(c.chapter));
      }
      const hits = mapCatalog({
        question: "",
        bookId: c.bookId,
        chapter: c.chapter,
        limit: 12,
      });
      const ids = hits.map((h) => h.id);
      assert.ok(
        ids.some((id) => id.startsWith("barnes-") || id.startsWith("maclaren-") || id.startsWith("vws-")),
        `expected Hub wave2 hit for ${c.bookId} ${c.chapter}, got ${ids.join(",")}`,
      );
    }
    assert.equal(
      CATALOG.filter((e) => /scofield|darby/i.test(e.id) || /scofield|darby/i.test(e.voice)).length,
      0,
    );
    assert.ok(CATALOG.filter((e) => e.id.startsWith("barnes-")).length >= 250);
    assert.ok(CATALOG.filter((e) => e.id.startsWith("hawker-")).length >= 250);
    const burkitt = CATALOG.find((e) => e.id === "burkitt-matthew-5");
    assert.ok(burkitt?.url.includes("/commentaries/494/"));
    const hawker1co = CATALOG.find((e) => e.id === "hawker-1corinthians-1");
    assert.ok(hawker1co?.url.includes("/1-corinthians/1/1"));
  });

  it("indexes wave3 Protestants and patristics; Scofield/Darby stay 0", () => {
    assert.ok(CATALOG.find((e) => e.id === "cambridge-matthew-5"));
    assert.ok(CATALOG.find((e) => e.id === "ellicott-romans-8"));
    assert.ok(CATALOG.find((e) => e.id === "owen-hebrews-1"));
    assert.ok(CATALOG.find((e) => e.id === "kretzmann-john-3"));
    assert.ok(CATALOG.find((e) => e.id === "luther-epistle-rom8-12"));
    assert.ok(CATALOG.find((e) => e.id === "cyril-john-book2"));
    assert.ok(CATALOG.find((e) => e.id === "cyril-luke-sermons-01-11"));
    assert.ok(CATALOG.find((e) => e.id === "augustine-1jn-h6"));
    assert.ok(CATALOG.find((e) => e.id === "augustine-nt-sermon-3"));
    assert.ok(CATALOG.find((e) => e.id === "augustine-harmony-1-1"));
    assert.ok(CATALOG.find((e) => e.id === "theodoret-romans-01"));
    assert.ok(CATALOG.find((e) => e.id === "theodoret-romans-02"));
    assert.ok(CATALOG.filter((e) => e.id.startsWith("cambridge-")).length >= 250);
    assert.ok(CATALOG.filter((e) => e.id.startsWith("kretzmann-")).length >= 250);
    assert.equal(CATALOG.filter((e) => e.id.startsWith("owen-hebrews-")).length, 13);
    assert.equal(
      CATALOG.filter((e) => /scofield|darby/i.test(e.id) || /scofield|darby/i.test(e.voice)).length,
      0,
    );
  });

  it("empty Inquire limit 9 keeps wave1+2 and seats Cambridge + Ellicott + Kretzmann", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    const WAVE2 = ["barnes-", "maclaren-", "vws-", "hawker-", "trapp-", "burkitt-"] as const;
    const cases = [
      {
        bookId: "MAT" as const,
        chapter: 5,
        verse: 3 as number | undefined,
        verseText:
          "Blessed are the poor in spirit: for theirs is the kingdom of heaven",
      },
      {
        bookId: "ROM" as const,
        chapter: 8,
        verse: 28 as number | undefined,
        verseText: "And we know that all things work together for good",
      },
      {
        bookId: "JHN" as const,
        chapter: 3,
        verse: 16 as number | undefined,
        verseText: "For God so loved the world, that he gave his only begotten Son",
      },
    ];
    const seenCambridge = new Set<string>();
    const seenEllicott = new Set<string>();
    const seenKretzmann = new Set<string>();
    for (const c of cases) {
      const hits = mapCatalog({
        question: "",
        bookId: c.bookId,
        chapter: c.chapter,
        verse: c.verse,
        verseText: c.verseText,
        limit: 9,
      });
      const ids = hits.map((h) => h.id);
      for (const prefix of ["gill-", "geneva-", "lange-"] as const) {
        assert.ok(
          ids.some((id) => id.startsWith(prefix)),
          `expected ${prefix}* for ${c.bookId} ${c.chapter}, got ${ids.join(",")}`,
        );
      }
      assert.ok(
        ids.some((id) => WAVE2.some((p) => id.startsWith(p))),
        `expected >=1 wave-2 for ${c.bookId} ${c.chapter}, got ${ids.join(",")}`,
      );
      // Scofield/Darby never seat
      assert.equal(
        ids.filter((id) => /scofield|darby/i.test(id)).length,
        0,
      );
      if (ids.some((id) => id.startsWith("cambridge-"))) seenCambridge.add(`${c.bookId}:${c.chapter}`);
      if (ids.some((id) => id.startsWith("ellicott-"))) seenEllicott.add(`${c.bookId}:${c.chapter}`);
      if (ids.some((id) => id.startsWith("kretzmann-"))) seenKretzmann.add(`${c.bookId}:${c.chapter}`);
    }
    assert.ok(
      seenCambridge.size >= 1,
      `expected Cambridge at least once across Matt 5 / Rom 8 / John 3`,
    );
    assert.ok(
      seenEllicott.size >= 1,
      `expected Ellicott at least once across samples, got cambridge=${[...seenCambridge]} kretzmann=${[...seenKretzmann]}`,
    );
    assert.ok(
      seenKretzmann.size >= 1,
      `expected Kretzmann at least once across samples, got cambridge=${[...seenCambridge]} ellicott=${[...seenEllicott]}`,
    );
  });

  it("indexes wave4 Pulpit Meyer EGT chapter pages; Scofield/Darby stay 0", () => {
    assert.ok(CATALOG.find((e) => e.id === "pulpit-romans-8"));
    assert.ok(CATALOG.find((e) => e.id === "meyer-john-1"));
    assert.ok(CATALOG.find((e) => e.id === "egt-matthew-5"));
    assert.ok(CATALOG.filter((e) => e.id.startsWith("pulpit-")).length >= 250);
    assert.ok(CATALOG.filter((e) => e.id.startsWith("meyer-")).length >= 250);
    assert.ok(CATALOG.filter((e) => e.id.startsWith("egt-")).length >= 250);
    const pulpit = CATALOG.find((e) => e.id === "pulpit-romans-8");
    assert.ok(pulpit?.url.includes("/commentaries/pulpit/romans/8.htm"));
    const meyer = CATALOG.find((e) => e.id === "meyer-john-1");
    assert.equal(meyer?.tradition, "lutheran");
    assert.equal(
      CATALOG.filter((e) => /scofield|darby/i.test(e.id) || /scofield|darby/i.test(e.voice)).length,
      0,
    );
  });

  it("indexes AUTO-APPROVE Hodge/Robertson/Expositors/Bengel/Spurgeon; Scofield/Darby stay 0", () => {
    assert.ok(CATALOG.find((e) => e.id === "hodge-eph-1"));
    assert.equal(CATALOG.filter((e) => e.id.startsWith("hodge-eph-")).length, 6);
    const hodge = CATALOG.find((e) => e.id === "hodge-eph-1");
    assert.ok(hodge?.url.includes("ccel.org/ccel/hodge/ephesians/ephesians.iii.i.html"));
    assert.equal(hodge?.voice, "Charles Hodge");

    assert.ok(CATALOG.find((e) => e.id === "robertson-matthew-5"));
    assert.ok(CATALOG.filter((e) => e.id.startsWith("robertson-")).length > 0);
    assert.equal(CATALOG.filter((e) => e.id.startsWith("robertson-john-")).length, 0);
    assert.equal(CATALOG.filter((e) => e.id.startsWith("robertson-hebrews-")).length, 0);
    assert.equal(CATALOG.filter((e) => e.id.startsWith("robertson-revelation-")).length, 0);
    const rwp = CATALOG.find((e) => e.id === "robertson-matthew-5");
    assert.ok(rwp?.url.includes("godrules.net/library/robert/robertmat5.htm"));

    assert.ok(CATALOG.find((e) => e.id === "expositors-matthew-5"));
    assert.ok(CATALOG.filter((e) => e.id.startsWith("expositors-")).length > 0);
    assert.equal(CATALOG.filter((e) => e.id.startsWith("expositors-colossians-")).length, 0);

    assert.ok(CATALOG.find((e) => e.id === "bengel-romans-8"));
    assert.ok(CATALOG.filter((e) => e.id.startsWith("bengel-")).length > 0);

    assert.ok(CATALOG.find((e) => e.id === "spurgeon-romans-8"));
    assert.ok(CATALOG.filter((e) => e.id.startsWith("spurgeon-")).length > 0);
    const spurgeon = CATALOG.find((e) => e.id === "spurgeon-romans-8");
    assert.ok(spurgeon?.url.includes("/commentaries/9/spurgeon-bible-commentary/romans/8"));

    assert.equal(
      CATALOG.filter((e) => /scofield|darby/i.test(e.id) || /scofield|darby/i.test(e.voice)).length,
      0,
    );
  });

  it("indexes WAVE-5B Ryle/Godet/Haldane/Broadus/Hodge-SI/Alford; Scofield/Darby stay 0", () => {
    const ryle = CATALOG.find((e) => e.id === "ryle-matthew-5");
    assert.ok(ryle, "ryle-matthew-5");
    assert.ok(
      ryle.url.includes("/commentary/ryle-expository-thoughts/MAT/5/"),
      ryle.url,
    );
    assert.equal(ryle.voice, "J. C. Ryle");
    assert.equal(
      CATALOG.some((e) => e.id === "ryle-matthew-1" || e.id === "ryle-matthew-28"),
      false,
      "Ryle Matthew 1 and 28 404 on SI — do not index",
    );
    assert.ok(CATALOG.find((e) => e.id === "ryle-mark-1"));
    assert.ok(CATALOG.find((e) => e.id === "ryle-luke-1"));
    assert.ok(CATALOG.find((e) => e.id === "ryle-john-21"));
    assert.ok(CATALOG.filter((e) => e.id.startsWith("ryle-")).length >= 80);

    const godetRom = CATALOG.find((e) => e.id === "godet-romans-8");
    assert.ok(godetRom?.url.includes("/commentary/godet/ROM/8/"));
    assert.ok(CATALOG.find((e) => e.id === "godet-luke-1"));
    assert.ok(CATALOG.find((e) => e.id === "godet-john-1"));
    assert.ok(CATALOG.find((e) => e.id === "godet-1corinthians-13"));
    assert.equal(CATALOG.filter((e) => e.id.startsWith("godet-")).length, 77);

    const haldane1 = CATALOG.find((e) => e.id === "haldane-romans-1");
    assert.ok(haldane1);
    assert.ok(
      haldane1.url.includes(
        "/books/haldane-robert-exposition-on-the-epistle-to-the-romans/3/",
      ),
      haldane1.url,
    );
    assert.ok(
      haldane1.altUrl?.includes(
        "/books/haldane-robert-exposition-on-the-epistle-to-the-romans/4/",
      ),
      haldane1.altUrl,
    );
    const haldane8 = CATALOG.find((e) => e.id === "haldane-romans-8");
    assert.ok(
      haldane8?.url.includes(
        "/books/haldane-robert-exposition-on-the-epistle-to-the-romans/12/",
      ),
    );
    assert.equal(CATALOG.filter((e) => e.id.startsWith("haldane-")).length, 16);
    assert.equal(
      CATALOG.some((e) =>
        /haldane-robert-exposition-on-the-epistle-to-the-romans\/(1|2|21)\/$/.test(
          e.url,
        ),
      ),
      false,
      "Haldane n=1 preface / n=2 intro / n=21 conclusion stay off the catalog",
    );

    const broadus = CATALOG.find((e) => e.id === "broadus-matthew-5");
    assert.ok(broadus?.url.includes("/commentary/broadus/MAT/5/"));
    assert.equal(CATALOG.filter((e) => e.id.startsWith("broadus-")).length, 28);

    const hodgeRom = CATALOG.find((e) => e.id === "hodge-romans-8");
    assert.ok(hodgeRom?.url.includes("/commentary/hodge/ROM/8/"));
    assert.equal(hodgeRom?.voice, "Charles Hodge");
    assert.ok(CATALOG.find((e) => e.id === "hodge-1corinthians-13"));
    assert.equal(
      CATALOG.some((e) => e.url.includes("/commentary/hodge/EPH/")),
      false,
      "Hodge SI Eph skipped — CCEL hodge-eph-* already indexed",
    );
    assert.ok(CATALOG.find((e) => e.id === "hodge-eph-1")?.url.includes("ccel.org"));

    const alford = CATALOG.find((e) => e.id === "alford-matthew-5");
    assert.ok(alford?.url.includes("/commentaries/alford/matthew/5.htm"));
    assert.ok(CATALOG.find((e) => e.id === "alford-romans-8"));
    assert.ok(CATALOG.filter((e) => e.id.startsWith("alford-")).length >= 250);

    const banned = /scofield|darby|kelly|bellett|pink|stier/i;
    assert.equal(
      CATALOG.filter((e) => banned.test(e.id) || banned.test(e.voice)).length,
      0,
    );
  });

  it("empty Inquire may seat Pulpit when a spare remains; never drops wave1", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    const hits = mapCatalog({
      question: "",
      bookId: "ROM",
      chapter: 8,
      verse: 28,
      verseText: "And we know that all things work together for good",
      limit: 9,
    });
    const ids = hits.map((h) => h.id);
    for (const prefix of ["gill-", "geneva-", "lange-"] as const) {
      assert.ok(
        ids.some((id) => id.startsWith(prefix)),
        `wave4 must not drop ${prefix}*, got ${ids.join(",")}`,
      );
    }
  });

  it("WAVE-5B spare interleave never drops wave1 on empty Inquire", () => {
    const hits = mapCatalog({
      question: "",
      bookId: "ROM",
      chapter: 8,
      verse: 28,
      verseText: "And we know that all things work together for good",
      limit: 9,
    });
    const ids = hits.map((h) => h.id);
    for (const prefix of ["gill-", "geneva-", "lange-"] as const) {
      assert.ok(
        ids.some((id) => id.startsWith(prefix)),
        `wave5 must not drop ${prefix}*, got ${ids.join(",")}`,
      );
    }
    assert.equal(hits.length, 9);
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

  it("truncates long Gill verse notes instead of dropping them", () => {
    const lemma =
      "Blessed are the poor in spirit, for theirs is the kingdom of heaven.";
    // One continuous <p> longer than 2200 chars — the BibleHub Gill shape that
    // used to vanish entirely under the hard length drop.
    const body =
      lemma +
      " " +
      "Not the poor in purse, but the poor in spirit; such as are sensible of their spiritual poverty, ".repeat(
        30,
      );
    assert.ok(body.length > 2200, `fixture length ${body.length}`);
    const html = `<p>${body}</p>`;
    const paras = paragraphsFromHtml(html);
    assert.equal(paras.length, 1, "long paragraph must be kept (truncated)");
    assert.ok(paras[0].length <= 2200);
    assert.ok(paras[0].startsWith("Blessed are the poor in spirit"));
    const picked = pickVerseParagraphs(
      paras,
      5,
      3,
      "Blessed are the poor in spirit...",
    );
    assert.ok(picked.length >= 1);
    assert.ok(
      picked[0].toLowerCase().includes("poor in spirit"),
      "pickVerseParagraphs must still hit the truncated Gill note",
    );
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

  it("matches a pericope row whose verses overlap a selected range", () => {
    // Selecting 4-8 spans two pericopes. A page covering 1-5 answers for the
    // part of the selection it reaches; containment would have dropped it.
    const pericope = {
      id: "calvin-romans-9-1",
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
    assert.ok(scoreEntry(pericope, tokens, "ROM", 9, [], 4, 8) > 0, "4-8 overlaps 1-5");
    assert.ok(scoreEntry(pericope, tokens, "ROM", 9, [], 1, 20) > 0, "a range that swallows it");
    assert.ok(scoreEntry(pericope, tokens, "ROM", 9, [], 5, 9) > 0, "touching at one verse counts");
    assert.equal(scoreEntry(pericope, tokens, "ROM", 9, [], 6, 12), 0, "6-12 is past the page");
    assert.equal(scoreEntry(pericope, tokens, "ROM", 9, [], 11, 16), 0, "well past it");
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

  it("boosts a pericope whose verses cover the inquired verse", () => {
    const pericope = {
      id: "calvin-romans-9-10-13",
      voice: "John Calvin",
      work: "Commentary on Romans",
      tradition: "reformed" as const,
      locus: "Romans 9:10-13",
      url: "https://ccel.org/ccel/calvin/calcom38/calcom38.xiii.iii.html",
      tags: ["romans", "calvin"],
      books: ["ROM"],
      chapters: [9],
      verses: [10, 13] as [number, number],
    };
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
    assert.ok(
      scoreEntry(pericope, tokens, "ROM", 9, [], 11) >
        scoreEntry(chapterPage, tokens, "ROM", 9, [], 11),
      "verse-true Calvin page must outrank a chapter page",
    );
  });
});

describe("Phase C pericope index", () => {
  it("pins calvin-rom-9 to Romans 9:1-5 and serves 9:11 from a sibling page", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    const first = CATALOG.find((r) => r.id === "calvin-rom-9");
    assert.ok(first, "calvin-rom-9 must remain");
    assert.deepEqual(first.verses, [1, 5]);
    assert.match(first.url, /calcom38\.xiii\.i\.html/);
    const hits = mapCatalog({
      question: "",
      bookId: "ROM",
      chapter: 9,
      verse: 11,
      verseText:
        "though they were not yet born and had done nothing either good or bad, in order that God's purpose of election might continue",
    });
    const ids = hits.map((h) => h.id);
    assert.equal(ids.includes("calvin-rom-9"), false, "9:1-5 cannot answer verse 11");
    const calvin = hits.find((h) => h.voice === "John Calvin");
    assert.ok(calvin, `expected a Calvin page for ROM 9:11, got ${ids.join(",")}`);
    assert.ok(calvin.verses, calvin.id);
    assert.ok(calvin.verses[0] <= 11 && calvin.verses[1] >= 11, calvin.locus);
  });

  it("indexes Catena Aurea per chapter for Matthew and Mark, not a reused section", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    const mat5 = CATALOG.find((r) => r.id === "aquinas-catena-matthew-5");
    assert.ok(mat5, "Matthew 5 catena chapter is missing");
    assert.match(mat5.url, /catena1\.ii\.v\.html/);
    assert.deepEqual(mat5.chapters, [5]);
    const mrk10 = CATALOG.find((r) => r.id === "aquinas-catena-mark-10");
    assert.ok(mrk10, "Mark 10 catena chapter is missing");
    assert.match(mrk10.url, /catena2\.iii\.x\.html/);
    assert.equal(
      CATALOG.some((r) => r.id === "aquinas-catena-john-1"),
      false,
      "John 1 must not point at the Mark catena",
    );
    const luke = CATALOG.find((r) => r.id === "aquinas-catena-luke");
    assert.ok(luke, "Catena Luke long page is missing");
    assert.equal(luke.url, "https://isidore.co/aquinas/CALuke.htm");
    assert.equal(luke.chapters?.length, 24);
    assert.ok(luke.chapters?.includes(15) && luke.chapters?.includes(24));
    const john = CATALOG.find((r) => r.id === "aquinas-catena-john");
    assert.ok(john, "Catena John long page is missing");
    assert.equal(john.url, "https://isidore.co/aquinas/CAJohn.htm");
    assert.equal(john.chapters?.length, 21);
    assert.equal(
      CATALOG.filter((r) => r.url === "https://isidore.co/aquinas/CALuke.htm")
        .length,
      1,
      "one Isidore Luke URL only",
    );
  });

  it("verifies Chrysostom NA 2302–2310 digits (PHP COL 1TH 2TH 1TI 2TI TIT PHM GAL)", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    const count = (needle: string) =>
      CATALOG.filter((e) => e.url.includes(`/fathers/${needle}`)).length;
    assert.equal(count("2302"), 15, "PHP 230201–230215");
    assert.equal(count("2303"), 12, "COL 230301–230312");
    assert.equal(count("2304"), 11, "1TH 230401–230411");
    assert.equal(count("2305"), 5, "2TH 23051–23055");
    assert.equal(count("2306"), 18, "1TI 230601–230618");
    assert.equal(count("2307"), 10, "2TI 230701–230710");
    assert.equal(count("2308"), 6, "TIT 23081–23086");
    assert.equal(count("2309"), 3, "PHM 23091–23093");
    assert.equal(count("2310"), 6, "GAL 23101–23106");
    assert.ok(CATALOG.some((e) => e.url.endsWith("/fathers/230201.htm")));
    assert.ok(CATALOG.some((e) => e.url.endsWith("/fathers/23051.htm")));
    assert.ok(CATALOG.some((e) => e.url.endsWith("/fathers/23106.htm")));
    assert.equal(
      CATALOG.some((e) => e.url.endsWith("/fathers/230216.htm")),
      false,
    );
    assert.equal(
      CATALOG.some((e) => e.url.endsWith("/fathers/230501.htm")),
      false,
    );
  });

  it("maps Chrysostom Homily 16 to Romans 9 from its opening lemma", async () => {
    const { attachWeakNtCatalog } = await import("./catalog-weak-nt.ts");
    attachWeakNtCatalog();
    const h16 = CATALOG.find((r) => r.id === "chrysostom-rom-h16");
    assert.ok(h16);
    assert.ok(h16.chapters?.includes(9), `expected ch 9, got ${h16.chapters}`);
    const hits = mapCatalog({
      question: "",
      bookId: "ROM",
      chapter: 9,
      verse: 11,
      verseText: "God's purpose of election",
    });
    assert.ok(
      hits.some((h) => h.id === "chrysostom-rom-h16"),
      `expected chrysostom-rom-h16, got ${hits.map((h) => h.id).join(",")}`,
    );
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
    assert.equal(paragraphMentionsVerse("See Romans 9:11 on this", 9, 11), false);
    assert.equal(paragraphMentionsVerse("Romans 9:11. On this the apostle rests election.", 9, 11), true);
    assert.equal(paragraphMentionsVerse("Romans 9:6-13 is one argument", 9, 11), true);
    assert.equal(paragraphMentionsVerse("4. Who are Israelites", 9, 11), false);
    assert.equal(paragraphMentionsVerse("111 is not a verse here", 9, 11), false);
  });

  it("does not treat a treatise '1.' / 'a)' outline as John 1:1", () => {
    const query =
      "In the beginning was the Word, and the Word was with God, and the Word was God";
    const outline =
      "a) The Word is not a creature. b) The Word was not made. c) The Word was God. d) The Word is the Son.";
    const section =
      "1. The Word is not a creature, nor a work of the Father, but God of God, the unmade Son.";
    const lemma =
      "John 1:1. In the beginning was the Word, and the Word was with God, and the Word was God. He was not made, for by him were all things made.";
    assert.equal(isSubstantiveQuote(outline), false);
    assert.equal(paragraphMentionsVerse(section, 1, 1), false);
    assert.equal(paragraphTreatsVerse(section, 1, 1, query), false);
    assert.equal(paragraphTreatsVerse(lemma, 1, 1, query), true);
    const picked = pickVerseParagraphs(
      [outline, section, lemma],
      1,
      1,
      query,
      2,
    );
    assert.ok(picked.length >= 1);
    assert.ok(
      picked.every((p) => /in the beginning was the word/i.test(p)),
      `got ${picked.map((p) => p.slice(0, 80))}`,
    );
  });

  it("still trusts a two-digit '11.' lemma and a parenthetical '(8)'", () => {
    assert.equal(paragraphMentionsVerse("11. For the children", 9, 11), true);
    assert.equal(
      paragraphMentionsVerse(
        "(8) He that loveth not knoweth not God; for God is love, which the apostle presses on the church.",
        4,
        8,
      ),
      true,
    );
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
    const unlabeled =
      "The Apostle shows that the election of God is free and depends on his calling alone, not on works.";
    const picked = pickVerseParagraphs(
      [unlabeled, UNRELATED],
      9,
      11,
      "election calling",
      2,
    );
    assert.ok(picked.length > 0);
  });

  it("drops labelled neighbour verses instead of falling back to them", () => {
    const picked = pickVerseParagraphs(
      [VERSE_4, UNRELATED],
      9,
      11,
      "Israelites anguish",
      2,
    );
    assert.equal(picked.length, 0, "verse-4 lemma must not fill a verse-11 ask");
  });

  it("behaves like pickParagraphs when no verse is supplied", () => {
    const paras = [VERSE_4, VERSE_11, UNRELATED];
    assert.deepEqual(
      pickVerseParagraphs(paras, undefined, undefined, "election", 2),
      pickParagraphs(paras, "election", 2),
    );
  });

  it("Matt 5:3 must not return a Matt 5:10-only chunk", () => {
    const v3 =
      "Matthew 5:3. Blessed are the poor in spirit - The word blessed means happy, referring to that which produces felicity. Poor in spirit is to have a humble opinion of ourselves.";
    const v10 =
      "Matthew 5:10. Blessed are they which are persecuted for righteousness sake - To persecute means literally to pursue; follow after, as one does a flying enemy.";
    const v10lemma =
      "Blessed are they which are persecuted for righteousness' sake: for theirs is the kingdom of heaven.";
    const query =
      "Blessed are the poor in spirit: for theirs is the kingdom of heaven";
    const picked = pickVerseParagraphs([v10, v10lemma, v3], 5, 3, query, 3);
    assert.ok(picked.length >= 1);
    assert.ok(
      picked.every((p) => /poor in spirit/i.test(p)),
      `got ${picked.map((p) => p.slice(0, 60))}`,
    );
    assert.ok(!picked.some((p) => /persecut/i.test(p) && !/poor in spirit/i.test(p)));
    assert.equal(paragraphTreatsVerse(v3, 5, 3, query), true);
    assert.equal(paragraphTreatsVerse(v10, 5, 3, query), false);
  });

  it("Rom 8:28 lands providence language from that verse note", () => {
    const v28 =
      "Romans 8:28. And we know that all things work together for good - The providence of God overrules every event so that it shall work for the good of his people.";
    const v1 =
      "Romans 8:1. There is therefore now no condemnation to them which are in Christ Jesus.";
    const query =
      "And we know that all things work together for good to them that love God";
    const picked = pickVerseParagraphs([v1, v28], 8, 28, query, 2);
    assert.equal(picked[0], v28);
    assert.ok(/work together for good|providence/i.test(picked[0]));
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

  it("rejects concatenated verse-ref spam bodies (EN and ES)", async () => {
    const { isSubstantiveQuote, isMostlyVerseRefs } = await import("./retrieve.ts");

    const spamEn =
      "John 1:1 John 1:2 John 1:3 John 1:4 John 1:5 John 1:6 John 1:7";
    const spamEs =
      "Juan 1:1 Juan 1:2 Juan 1:3 Juan 1:4 Juan 1:5 Juan 1:6";
    const mixed =
      "John 1:1 · John 1:2 · John 1:3 · John 1:4 · Romans 8:28 · Romans 8:29";

    assert.equal(isMostlyVerseRefs(spamEn), true);
    assert.equal(isMostlyVerseRefs(spamEs), true);
    assert.equal(isMostlyVerseRefs(mixed), true);
    assert.equal(isSubstantiveQuote(spamEn), false);
    assert.equal(isSubstantiveQuote(spamEs), false);
    assert.equal(isSubstantiveQuote(mixed), false);

    const real =
      "In Him was life; and the life was the light of men. Cf. John 1:4 for the parallel.";
    assert.equal(isMostlyVerseRefs(real), false);
    assert.equal(isSubstantiveQuote(real), true);
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
describe("reserved seats survive to cards", () => {
  it("gives BibleHub the long-page byte cap", () => {
    assert.equal(byteCapFor("https://biblehub.com/commentaries/lange/matthew/5.htm"), 600_000);
    assert.equal(byteCapFor("https://www.biblehub.com/commentaries/lange/romans/8.htm"), 600_000);
    assert.equal(byteCapFor("https://biblehub.com/commentaries/gill/john/3.htm"), 600_000);
    assert.equal(byteCapFor("https://www.newadvent.org/fathers/1302.htm"), 600_000);
    assert.equal(byteCapFor("https://ccel.org/ccel/calvin/calcom38.iv.html"), 600_000);
    assert.equal(byteCapFor("https://www.ccel.org/ccel/calvin/calcom38.iv.html"), 600_000);
    assert.equal(byteCapFor("https://tertullian.org/fathers/theodoret_commentary_on_romans_01.htm"), 600_000);
    assert.equal(byteCapFor("https://isidore.co/aquinas/CALuke.htm"), 600_000);
    assert.equal(byteCapFor("https://www.sermonindex.net/commentary/godet/ROM/8/"), 600_000);
    assert.equal(byteCapFor("https://sermonindex.net/commentary/ryle-expository-thoughts/MAT/5/"), 600_000);
    assert.equal(byteCapFor("https://godrules.net/library/calvin/calvin.htm"), 180_000);
  });

  it("appends a missing reserved extract after a 4-card stack dropped it", () => {
    const para = (who: string, verse: string) =>
      `${who} on the verse: ${verse} is the first foundation, not a passing mention of the word in an objection.`;
    const entry = (
      id: string,
      voice: string,
      url: string,
    ) => ({
      id,
      voice,
      work: "Commentary",
      tradition: "reformed" as const,
      locus: "Matthew 5",
      url,
      tags: ["matthew"],
      books: ["MAT"],
      chapters: [5],
    });
    const extracts = [
      {
        entry: entry("chrysostom-matthew-15", "John Chrysostom", "https://www.newadvent.org/fathers/200115.htm"),
        url: "https://www.newadvent.org/fathers/200115.htm",
        paragraphs: [para("Chrysostom", "Blessed are the poor in spirit")],
      },
      {
        entry: entry("aquinas-catena-matt5", "Thomas Aquinas", "https://www.ccel.org/ccel/aquinas/catena1.ii.html"),
        url: "https://www.ccel.org/ccel/aquinas/catena1.ii.html",
        paragraphs: [para("Aquinas", "Blessed are the poor in spirit")],
      },
      {
        entry: entry("gill-matthew-5", "John Gill", "https://biblehub.com/commentaries/gill/matthew/5.htm"),
        url: "https://biblehub.com/commentaries/gill/matthew/5.htm",
        paragraphs: [para("Gill", "Blessed are the poor in spirit")],
      },
      {
        entry: entry("geneva-matthew-5", "Geneva Bible", "https://biblehub.com/commentaries/gsb/matthew/5.htm"),
        url: "https://biblehub.com/commentaries/gsb/matthew/5.htm",
        paragraphs: [para("Geneva", "Blessed are the poor in spirit")],
      },
      {
        entry: entry("lange-matthew-5", "John Peter Lange", "https://biblehub.com/commentaries/lange/matthew/5.htm"),
        url: "https://biblehub.com/commentaries/lange/matthew/5.htm",
        paragraphs: [para("Lange", "Blessed are the poor in spirit")],
      },
    ];
    const cards = [
      {
        voice: "John Chrysostom",
        work: "Homilies",
        tradition: "eastern-patristic" as const,
        quote: para("Chrysostom", "Blessed are the poor in spirit"),
        citation: "Homily 15",
        url: extracts[0].url,
        source: "generated" as const,
        grounded: true,
      },
      {
        voice: "Thomas Aquinas",
        work: "Catena",
        tradition: "scholastic" as const,
        quote: para("Aquinas", "Blessed are the poor in spirit"),
        citation: "Catena Aurea",
        url: extracts[1].url,
        source: "generated" as const,
        grounded: true,
      },
      {
        voice: "John Gill",
        work: "Exposition",
        tradition: "reformed" as const,
        quote: para("Gill", "Blessed are the poor in spirit"),
        citation: "Matthew 5",
        url: extracts[2].url,
        source: "generated" as const,
        grounded: true,
      },
      {
        voice: "Geneva Bible",
        work: "Notes",
        tradition: "reformed" as const,
        quote: para("Geneva", "Blessed are the poor in spirit"),
        citation: "Matthew 5",
        url: extracts[3].url,
        source: "generated" as const,
        grounded: true,
      },
    ];
    const filled = ensureReservedCards(cards, extracts);
    assert.equal(filled.length, 5);
    assert.ok(filled.some((c) => c.voice === "John Peter Lange"));
    const lange = filled.find((c) => c.voice === "John Peter Lange");
    assert.ok(lange);
    assert.equal(lange.url, "https://biblehub.com/commentaries/lange/matthew/5.htm");
    assert.ok(lange.quote.includes("Lange on the verse"));
    assert.equal(lange.grounded, false);
    assert.equal(lange.paraphrased, false);

    const already = ensureReservedCards(filled, extracts);
    assert.equal(already.length, 5, "must not duplicate a reserved voice already on the desk");

    const missingGill = cards.filter((c) => c.voice !== "John Gill");
    const withGill = ensureReservedCards(missingGill, extracts);
    assert.ok(withGill.some((c) => c.voice === "John Gill"));
    assert.ok(withGill.some((c) => c.voice === "John Peter Lange"));
    const gill = withGill.find((c) => c.voice === "John Gill");
    assert.ok(gill?.quote.includes("Gill on the verse"));
  });

  it("does not force a reserved card when the extract is wrong-verse", () => {
    const wrong =
      "Matthew 5:10. Blessed are they which are persecuted for righteousness sake - To persecute means literally to pursue after an enemy on account of religion.";
    const extracts = [
      {
        entry: {
          id: "barnes-matthew-5",
          voice: "Albert Barnes",
          work: "Notes",
          tradition: "reformed" as const,
          locus: "Matthew 5",
          url: "https://biblehub.com/commentaries/barnes/matthew/5.htm",
          tags: ["matthew", "barnes"],
          books: ["MAT"],
          chapters: [5],
        },
        url: "https://biblehub.com/commentaries/barnes/matthew/5.htm",
        paragraphs: [wrong],
      },
    ];
    const cards = [
      {
        voice: "John Chrysostom",
        work: "Homilies",
        tradition: "eastern-patristic" as const,
        quote: "Blessed are the poor in spirit is the first foundation of the kingdom, not a passing mention.",
        citation: "Homily 15",
        url: "https://www.newadvent.org/fathers/200115.htm",
        source: "generated" as const,
        grounded: true,
      },
    ];
    const query = "Blessed are the poor in spirit: for theirs is the kingdom of heaven";
    const filled = ensureReservedCards(cards, extracts, {
      chapter: 5,
      verse: 3,
      query,
    });
    assert.equal(filled.length, 1);
    assert.ok(!filled.some((c) => c.voice === "Albert Barnes"));
  });
});

describe("verse-perfect extracts", () => {
  const MAT53 =
    "Blessed are the poor in spirit: for theirs is the kingdom of heaven";
  const ROM828 =
    "And we know that all things work together for good to them that love God";
  const JHN316 =
    "For God so loved the world, that he gave his only begotten Son";

  it("Rom 8:28 Barnes neighbour lean: picks providence note, not 8:27/8:33 cross-refs", () => {
    const intro =
      "This chapter is precious. (5) it gives the assurance that all things shall work together for good, Romans 8:28-30. (6) it ministers consolation from God justifying the believer.";
    const v27 =
      "And he that searcheth the hearts - God. To search the heart is one of his attributes; Jeremiah 17:10. Knoweth what is the mind of the Spirit — Note Romans 8:28 briefly.";
    const v28 =
      "Romans 8:28. And we know - This verse introduces another source of consolation drawn from the fact that all things are under the direction of an infinitely wise Being, whose providence overrules every event for the good of his people.";
    const v33 =
      "Who shall lay anything to the charge - This expression is taken from courts of law. Note, Romans 8:28. As they are the chosen of God, they are dear to him.";
    const picked = pickVerseParagraphs([intro, v27, v33, v28], 8, 28, ROM828, 2);
    assert.equal(picked.length, 1);
    assert.equal(picked[0], v28);
    assert.ok(/providence|infinitely wise|work together|all things are under/i.test(picked[0]));
    assert.equal(paragraphTreatsVerse(v28, 8, 28, ROM828), true);
    assert.equal(paragraphTreatsVerse(v27, 8, 28, ROM828), false);
    assert.equal(paragraphTreatsVerse(v33, 8, 28, ROM828), false);
    assert.equal(paragraphTreatsVerse(intro, 8, 28, ROM828), false);
  });

  it("Matt 5:3 Hub labels: target note wins; 5:10 neighbour dropped", () => {
    const v3 =
      "Matthew 5:3. Blessed are the poor in spirit - The word blessed means happy, referring to that which produces felicity. Poor in spirit is to have a humble opinion of ourselves.";
    const v10 =
      "Matthew 5:10. Blessed are they which are persecuted for righteousness sake - To persecute means literally to pursue; follow after, as one does a flying enemy.";
    const v10mid =
      "Matthew 5:10. Blessed are they which are persecuted,.... Not for crimes, and yet the saints are happy; for theirs is the kingdom of heaven: the same blessedness as the poor in spirit, ver. 3.";
    const picked = pickVerseParagraphs([v10, v10mid, v3], 5, 3, MAT53, 3);
    assert.equal(picked.length, 1);
    assert.equal(picked[0], v3);
    assert.equal(paragraphTreatsVerse(v10mid, 5, 3, MAT53), false);
  });

  it("John 3:16 Gill: only the loved-the-world lemma, not 3:15/3:17 neighbours", () => {
    const v15 =
      "John 3:15. That whosoever believeth in him,.... Whether Jew or Gentile, a greater or a lesser sinner, and of whatsoever state and condition, shall not perish but have eternal life.";
    const v16 =
      "John 3:16. For God so loved the world,.... The Persic version reads men: but not every man in the world is here meant, or all the individuals of mankind without exception.";
    const v17 =
      "John 3:17. For God sent not his Son into the world,.... God did send his Son into the world in the likeness of sinful flesh, being made of a woman, yet not to condemn the world.";
    const picked = pickVerseParagraphs([v15, v17, v16], 3, 16, JHN316, 3);
    assert.equal(picked.length, 1);
    assert.equal(picked[0], v16);
    assert.equal(paragraphTreatsVerse(v15, 3, 16, JHN316), false);
    assert.equal(paragraphTreatsVerse(v17, 3, 16, JHN316), false);
  });

  it("Heb / Rev / 1 John heading labels are detected", () => {
    assert.equal(
      paragraphMentionsVerse(
        "Hebrews 1:1. God, who at sundry times and in divers manners spake in time past unto the fathers by the prophets,",
        1,
        1,
      ),
      true,
    );
    assert.equal(
      paragraphMentionsVerse(
        "Rev. 1:1 The Revelation of Jesus Christ, which God gave unto him, to shew unto his servants things which must shortly come to pass.",
        1,
        1,
      ),
      true,
    );
    assert.equal(
      paragraphMentionsVerse(
        "1 John 4:8. He that loveth not knoweth not God; for God is love, and this love is the ground of our fellowship.",
        4,
        8,
      ),
      true,
    );
    assert.equal(
      paragraphMentionsVerse(
        "Vs. 8 He that loveth not knoweth not God; for God is love in truth and deed toward the brethren.",
        4,
        8,
      ),
      true,
    );
    assert.equal(
      paragraphMentionsVerse(
        "(8) He that loveth not knoweth not God; for God is love, which the apostle presses on the church.",
        4,
        8,
      ),
      true,
    );
  });

  it("prefer empty over wrong-neighbour when the page has other verse labels", () => {
    const picked = pickVerseParagraphs(
      [
        "Hebrews 1:2. Hath in these last days spoken unto us by his Son - Whom he hath appointed heir of all things.",
        "Hebrews 1:5. For unto which of the angels said he at any time, Thou art my Son - This day have I begotten thee.",
      ],
      1,
      1,
      "God, who at sundry times and in divers manners spake in time past unto the fathers by the prophets",
      2,
    );
    assert.equal(picked.length, 0, "Heb 1:2/1:5 must not fill a Heb 1:1 ask");
  });

  it("mid-paragraph cross-refs do not count as treating the verse", () => {
    assert.equal(
      paragraphMentionsVerse(
        "Note, Romans 8:28. As they are the chosen of God, they are dear to him and will be saved.",
        8,
        28,
      ),
      false,
    );
    assert.equal(
      paragraphMentionsVerse(
        "From verse 3 to the 10th inclusive, our Lord respects the whole body of his true disciples and followers.",
        5,
        3,
      ),
      false,
    );
  });

  it("verse-true cards cite the verse, not a vague chapter-only locus", () => {
    assert.equal(verseTrueLocus("Romans 8", 8, 28), "Romans 8:28");
    assert.equal(verseTrueLocus("Matthew 5", 5, 3), "Matthew 5:3");
    assert.equal(verseTrueLocus("John 3", 3, 16), "John 3:16");
    assert.equal(verseTrueLocus("Romans 8:28", 8, 28), "Romans 8:28");
    assert.equal(verseTrueLocus("Homily 15", 5, 3), "Homily 15");
    assert.equal(verseTrueLocus("Romans 8", 8, 28, 30), "Romans 8:28-30");

    const extract = {
      entry: {
        id: "barnes-romans-8",
        voice: "Albert Barnes",
        work: "Notes",
        tradition: "reformed" as const,
        locus: "Romans 8",
        url: "https://biblehub.com/commentaries/barnes/romans/8.htm",
        tags: ["romans", "barnes"],
        books: ["ROM"],
        chapters: [8],
      },
      url: "https://biblehub.com/commentaries/barnes/romans/8.htm",
      paragraphs: [
        "Romans 8:28. And we know - This verse introduces another source of consolation drawn from providence, for all things work together for good to them that love God.",
      ],
    };
    const filled = ensureReservedCards([], [extract], {
      chapter: 8,
      verse: 28,
      query: ROM828,
    });
    assert.equal(filled.length, 1);
    assert.match(filled[0].citation, /Romans 8:28/);
    assert.equal(/Romans 8(?!:)/.test(filled[0].citation.split("\u00b7")[0] ?? filled[0].citation), false);
  });

  it("Hub versenum rewrite glues the ref onto the following note", () => {
    const html = `
      <div class="versenum"><a href="/romans/8-28.htm">Romans 8:28</a></div>
      <div class="verse">And we know that all things work together for good.</div>
      And we know - This verse introduces another source of consolation drawn from the providence of God over every event for his people.
      <div class="versenum"><a href="/romans/8-29.htm">Romans 8:29</a></div>
      <div class="verse">For whom he did foreknow, he also did predestinate.</div>
      For whom he did foreknow - The word used here means that God knew them as his own with affection.
    `;
    const paras = paragraphsFromHtml(html);
    const picked = pickVerseParagraphs(paras, 8, 28, ROM828, 2);
    assert.ok(picked.length >= 1);
    assert.ok(picked.every((p) => paragraphTreatsVerse(p, 8, 28, ROM828)));
    assert.ok(picked.some((p) => /^Romans 8:28\b/.test(p) && /providence|consolation/i.test(p)));
    assert.ok(!picked.some((p) => /foreknow|predestinate/i.test(p) && !/8:28/.test(p.slice(0, 20))));
  });
});