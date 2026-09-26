import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseApiBibleText } from "./api-bible.ts";

// Synthetic fixture exercising the same shapes API.Bible text chapters use:
// standalone headings, mid-line [N] markers, short verses ending in ";",
// and indented poetry continuation lines. None of this is Scripture text.
const SAMPLE = [
  "Greeting to the Readers",
  "     [1] Marcus, a servant of the assembly at Harbor Town,",
  "    To those who are called and gathered by the common hope,",
  "     [2] Kindness, peace, and goodwill be multiplied to you.",
  "Hold Fast to the Teaching",
  "     [3] Friends, while I was eager to write to you.  [4] For certain travelers",
  "have arrived unannounced, who long ago were expected by no one.",
  "     [22] And on some have patience, making a distinction;",
  "Blessing at the Close",
  "   [24] Now to the One who is able to keep you from stumbling,",
  "    And to present you blameless",
  "    Before the presence of great joy,",
  "     [25] To the only Wise, be honor. Amen.",
].join("\n");

describe("parseApiBibleText", () => {
  it("splits mid-line markers into verses", () => {
    const verses = parseApiBibleText(SAMPLE);
    assert.deepEqual(
      verses.map((v) => v.verse),
      [1, 2, 3, 4, 22, 24, 25],
    );
  });

  it("attaches standalone headings as the next verse's title", () => {
    const verses = parseApiBibleText(SAMPLE);
    assert.equal(verses[0].title, "Greeting to the Readers");
    assert.equal(verses[2].title, "Hold Fast to the Teaching");
    assert.equal(verses[5].title, "Blessing at the Close");
  });

  it("keeps short verses ending in semicolons instead of eating them", () => {
    const verses = parseApiBibleText(SAMPLE);
    const v22 = verses.find((v) => v.verse === 22);
    assert.ok(v22);
    assert.equal(
      v22.text,
      "And on some have patience, making a distinction;",
    );
    assert.equal(v22.title, undefined);
  });

  it("folds indented continuation lines into the open verse", () => {
    const verses = parseApiBibleText(SAMPLE);
    assert.match(verses[0].text, /gathered by the common hope/);
    const v24 = verses.find((v) => v.verse === 24);
    assert.match(v24!.text, /great joy/);
    assert.equal(v24!.title, "Blessing at the Close");
  });

  it("returns nothing for marker-less content", () => {
    assert.deepEqual(parseApiBibleText("no markers here"), []);
  });
});
