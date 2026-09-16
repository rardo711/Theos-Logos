import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasEnglishLexiconChip,
  lookupEnglishByStrongs,
  lookupEnglishWordNow,
  referenceToSilVerseKey,
  englishAttribution,
} from "./english.ts";
import { getLocalLexicon } from "./local.ts";
import { lookupWordNow } from "./stepbible.ts";

describe("english UBS lexicon", () => {
  it("G3056 returns English UBS glosses word/saying/message", () => {
    const hit = lookupEnglishByStrongs("G3056");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G3056");
    assert.match(hit?.lemma ?? "", /λόγος|λόγος/);
    assert.equal(hit?.gloss, "word");
    assert.ok(hit?.glossExtras.includes("saying"));
    assert.ok(hit?.glossExtras.includes("message"));
    assert.match(hit?.sentido ?? "", /stated|said|content/i);
    assert.equal(hit?.source, "ubs");
    assert.match(hit?.attribution ?? "", /CC BY-SA/);
    assert.match(englishAttribution, /United Bible Societies|UBS/);
  });

  it("accepts zero-padded Strong's G03056", () => {
    const hit = lookupEnglishByStrongs("G03056");
    assert.equal(hit?.strongs, "G3056");
    assert.equal(hit?.gloss, "word");
  });

  it("English surface image resolves to a Strong's entry", () => {
    assert.equal(hasEnglishLexiconChip("image"), true);
    const hit = lookupEnglishWordNow("image");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G1504");
    assert.equal(hit?.source, "ubs");
  });

  it("maps Colossians 1:15 to SIL verse key 051001015", () => {
    assert.equal(referenceToSilVerseKey("Colossians 1:15"), "051001015");
    assert.equal(referenceToSilVerseKey("Colosenses 1:15"), "051001015");
  });

  it("G1504 + Colossians 1:15 selects verse-sense 58.35 (not first 6.96)", () => {
    const hit = lookupEnglishByStrongs("G1504", "Colossians 1:15");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G1504");
    assert.equal(hit?.entryCode, "58.35");
    assert.equal(hit?.senseMatchedByReference, true);
    assert.match(hit?.gloss ?? "", /same form|likeness/i);
    assert.equal(hit?.domains[0], "Nature, Class, Example");
    // Without verse context, first UBS meaning is 6.96 Artifacts
    const fallback = lookupEnglishByStrongs("G1504");
    assert.equal(fallback?.entryCode, "6.96");
    assert.ok(fallback?.glossExtras.includes("image") || fallback?.gloss === "likeness");
  });

  it("tap image on Colossians 1:15 resolves to G1504 verse-sense UBS EN", () => {
    const hit = lookupEnglishWordNow("image", "Colossians 1:15");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G1504");
    assert.equal(hit?.entryCode, "58.35");
    assert.equal(hit?.senseMatchedByReference, true);
    assert.equal(hit?.source, "ubs");
  });

  it("G4416 + Colossians 1:15 selects firstborn verse-sense", () => {
    const hit = lookupEnglishByStrongs("G4416", "Colossians 1:15");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G4416");
    assert.equal(hit?.senseMatchedByReference, true);
    assert.match(hit?.gloss ?? "", /firstborn|existing first|superior/i);
    assert.ok((hit?.relatedSenseCount ?? 0) >= 1);
  });

  it("tap firstborn on Colossians 1:15 resolves to G4416 UBS EN", () => {
    const hit = lookupEnglishWordNow("firstborn", "Colossians 1:15");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G4416");
    assert.equal(hit?.senseMatchedByReference, true);
    assert.equal(hit?.source, "ubs");
  });

  it("NT chip image is UBS Greek, not Hebrew and not Johannine local leak", () => {
    const ubs = lookupEnglishWordNow("image", "Colossians 1:15");
    assert.equal(ubs?.strongs, "G1504");
    assert.equal(ubs?.source, "ubs");
    // local Johannine notes must not apply to Colossians
    assert.equal(getLocalLexicon("image", "Colossians 1:15"), null);
    assert.equal(getLocalLexicon("word", "Colossians 1:15"), null);
    // STEPBible gloss index is Hebrew-only for "image" — on NT return null
    // (never Hebrew). Reception locale=en NT uses UBS EN above, not STEPBible.
    assert.equal(lookupWordNow("image", "Colossians 1:15"), null);
  });

  it("G746 + John 1:1 selects Time beginning (67.65), not Aspect", () => {
    const hit = lookupEnglishByStrongs("G746", "John 1:1");
    assert.ok(hit);
    assert.equal(hit?.entryCode, "67.65");
    assert.equal(hit?.gloss, "beginning");
    assert.equal(hit?.domains[0], "Time");
    assert.equal(hit?.senseMatchedByReference, true);
  });
});
