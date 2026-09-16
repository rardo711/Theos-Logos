import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  englishAttribution,
  hasEnglishLexiconChip,
  lookupEnglishByStrongs,
  lookupEnglishWordNow,
} from "./english.ts";

describe("english UBS lexicon", () => {
  it("G3056 returns English UBS glosses word/saying/message", () => {
    const hit = lookupEnglishByStrongs("G3056");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G3056");
    assert.equal(hit?.lemma, "λόγος");
    assert.ok(
      ["word", "saying", "message"].includes((hit?.gloss ?? "").toLowerCase()),
    );
    assert.ok(
      (hit?.glossExtras ?? []).some((g) =>
        ["saying", "message", "statement"].includes(g.toLowerCase()),
      ),
    );
    assert.match(hit?.sense ?? "", /stated|said|communication/i);
    assert.equal(hit?.source, "ubs");
    assert.match(hit?.attribution ?? "", /CC BY-SA/);
    assert.match(englishAttribution, /United Bible Societies|UBS/);
  });

  it("accepts zero-padded Strong's G03056", () => {
    const hit = lookupEnglishByStrongs("G03056");
    assert.equal(hit?.strongs, "G3056");
  });

  it("English surface 'word' resolves to a Strong's entry", () => {
    assert.equal(hasEnglishLexiconChip("word"), true);
    const hit = lookupEnglishWordNow("word");
    assert.ok(hit);
    assert.ok(hit?.strongs?.startsWith("G"));
  });

  it("G3056 + John 1:1 selects the verse-scoped 'Word' sense (33.100)", () => {
    const hit = lookupEnglishByStrongs("G3056", "John 1:1");
    assert.ok(hit);
    assert.equal(hit?.senseMatchedByReference, true);
    assert.equal(hit?.gloss, "Word");
    assert.equal(hit?.entryCode, "33.100");
  });

  it("G25 + Romans 8:28 selects 'to love' by verse reference (not G26 noun)", () => {
    const hit = lookupEnglishByStrongs("G25", "Romans 8:28");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G25");
    assert.equal(hit?.senseMatchedByReference, true);
    assert.match(hit?.gloss ?? "", /love/i);
  });

  it("word 'love' in Romans 8:28 resolves to G25 via verse-scoped pick", () => {
    const hit = lookupEnglishWordNow("love", "Romans 8:28");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G25");
    assert.equal(hit?.senseMatchedByReference, true);
  });

  it("G746 + John 1:1 selects UBS 67.65 (not first-meaning aspect)", () => {
    const hit = lookupEnglishByStrongs("G746", "John 1:1");
    assert.ok(hit);
    assert.equal(hit?.entryCode, "67.65");
    assert.equal(hit?.senseMatchedByReference, true);
    assert.match(hit?.gloss ?? "", /beginning/i);
  });

  it("G4416 + Colossians 1:15 selects 'firstborn' by verse reference", () => {
    const hit = lookupEnglishByStrongs("G4416", "Colossians 1:15");
    assert.ok(hit);
    assert.equal(hit?.senseMatchedByReference, true);
    assert.match(hit?.gloss ?? "", /firstborn/i);
    assert.ok((hit?.domains ?? []).length > 0);
  });

  it("eng short gloss is attached but hero comes from UBS Glosses", () => {
    const hit = lookupEnglishByStrongs("G3056");
    assert.ok(hit?.shortGloss);
    assert.equal(hit?.source, "ubs");
  });

  it("unknown Strong's returns null", () => {
    assert.equal(lookupEnglishByStrongs("G99999"), null);
    assert.equal(lookupEnglishByStrongs("xyz"), null);
  });
});
