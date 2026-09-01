import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { esvQuery, parseEsvHtml, parseEsvPassage } from "./esv.ts";
import { attachNtHeadings, ntHeading, ntHeadingCount } from "./nt-headings.ts";
import { getBook } from "./books.ts";
import { getSeed } from "./seed.ts";

describe("parseEsvPassage", () => {
  it("splits bracketed verse numbers and collapses whitespace", () => {
    const raw = `
  [1] Alpha word one. [2] Beta word two.
      [3] Gamma
          word three.
 (ESV)
`;
    assert.deepEqual(parseEsvPassage(raw), [
      { verse: 1, text: "Alpha word one." },
      { verse: 2, text: "Beta word two." },
      { verse: 3, text: "Gamma word three." },
    ]);
  });

  it("attaches heading lines in the text payload to the following verse", () => {
    const raw = `
John 1

The Word Became Flesh

[1] In the beginning was the Word.
[2] He was in the beginning with God.

The Testimony of John the Baptist

[19] And this is the testimony of John.
`;
    const verses = parseEsvPassage(raw);
    assert.equal(verses[0]?.title, "The Word Became Flesh");
    assert.match(verses[0]?.text ?? "", /In the beginning/);
    assert.equal(verses[1]?.title, undefined);
    assert.equal(verses[2]?.verse, 19);
    assert.equal(verses[2]?.title, "The Testimony of John the Baptist");
  });
});

describe("parseEsvHtml", () => {
  it("attaches h3 headings to the following verse", () => {
    const html = `
      <h2>John 1</h2>
      <h3>The Word Became Flesh</h3>
      <p><b class="verse-num">1</b>In the beginning was the Word.</p>
      <p><b class="verse-num">2</b>He was in the beginning with God.</p>
      <h3>The Testimony of John the Baptist</h3>
      <p><span class="verse-num">19</span>And this is the testimony of John.</p>
    `;
    const verses = parseEsvHtml(html);
    assert.equal(verses[0]?.verse, 1);
    assert.equal(verses[0]?.title, "The Word Became Flesh");
    assert.match(verses[0]?.text ?? "", /In the beginning/);
    assert.equal(verses[1]?.title, undefined);
    assert.equal(verses[2]?.verse, 19);
    assert.equal(verses[2]?.title, "The Testimony of John the Baptist");
  });

  it("reads single-quoted verse numbers and extra_text headings", () => {
    const html = `
      <h2 class="extra_text">John 1</h2>
      <p class="extra_text">The Word Became Flesh</p>
      <p><b class='verse-num'>1 </b>In the beginning was the Word.</p>
    `;
    const verses = parseEsvHtml(html);
    assert.equal(verses[0]?.verse, 1);
    assert.equal(verses[0]?.title, "The Word Became Flesh");
  });
});

describe("esvQuery", () => {
  it("uses Psalm (singular) for the Psalter", () => {
    assert.equal(esvQuery(getBook("PSA"), 119), "Psalm 119");
  });

  it("keeps the canonical book name otherwise", () => {
    assert.equal(esvQuery(getBook("JHN"), 1), "John 1");
    assert.equal(esvQuery(getBook("1CO"), 13), "1 Corinthians 13");
  });
});

describe("nt headings", () => {
  it("indexes a New Testament set", () => {
    assert.ok(ntHeadingCount() > 200);
    assert.equal(ntHeading("JHN", 1, 1, "en"), "The Word Became Flesh");
    assert.equal(ntHeading("JHN", 1, 1, "es"), "El Verbo se hizo carne");
    assert.equal(ntHeading("REV", 2, 8, "en"), "To the Church in Smyrna");
    assert.equal(ntHeading("REV", 3, 14, "es"), "A la iglesia en Laodicea");
  });

  it("fills seed John 1 when the ESV HTML is missing", () => {
    const seeded = getSeed("JHN", 1);
    assert.ok(seeded);
    const withTitles = attachNtHeadings(seeded, "en");
    assert.equal(withTitles.verses[0]?.title, "The Word Became Flesh");
    assert.equal(
      withTitles.verses.find((v) => v.verse === 19)?.title,
      "The Testimony of John the Baptist",
    );
  });
});
