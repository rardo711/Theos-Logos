import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getLocalLexicon } from "./local.ts";
import {
  hasLexiconChip,
  lookupByEnglishSync,
  lookupByStrongsSync,
  lookupWordNow,
} from "./stepbible.ts";

describe("lexicon chips", () => {
  it("uses getLocalLexicon first for John 1 Word", () => {
    const local = getLocalLexicon("Word", "John 1:1");
    const now = lookupWordNow("Word", "John 1:1");
    assert.ok(local);
    assert.equal(local?.lemma, "λόγος");
    assert.equal(local?.strongs, "G3056");
    assert.equal(now?.gloss, local?.gloss);
  });

  it("maps κόσμος to G2889, never G2884", () => {
    const hits = lookupByEnglishSync("world");
    assert.ok(hits.some((e) => e.strongs === "G2889"));
    assert.equal(
      hits.find((e) => e.strongs === "G2884"),
      undefined,
    );
    const measure = lookupByStrongsSync("G2884");
    if (measure) assert.notEqual(measure.lemma, "κόσμος");
    const kosmos = lookupByStrongsSync("G2889");
    assert.ok(kosmos?.lemma.includes("σμ"));
  });

  it("indexes the John 1 lemmas", () => {
    const ids = {
      G3056: "λόγος",
      G746: "ἀρχή",
      G2316: "θεός",
      G5457: "φῶς",
      G4653: "σκοτία",
      G2222: "ζωή",
      G4561: "σάρξ",
      G1391: "δόξα",
      G5485: "χάρις",
      G225: "ἀλήθεια",
      G2889: "κόσμος",
      G286: "ἀμνός",
    };
    for (const [id, lemma] of Object.entries(ids)) {
      const hit = lookupByStrongsSync(id);
      assert.equal(hit?.lemma, lemma, id);
      assert.equal(hit?.source, "AS");
    }
  });

  it("hides chips with no entry and shows those with one", () => {
    assert.equal(hasLexiconChip("xyzzy", "John 1:21"), false);
    assert.equal(hasLexiconChip("answered", "John 1:21"), false);
    assert.equal(hasLexiconChip("Word", "John 1:1"), true);
    assert.equal(hasLexiconChip("world", "John 1:10"), true);
    assert.equal(hasLexiconChip("lamb", "John 1:29"), true);
    assert.equal(hasLexiconChip("faith", "John 1:12"), true);
  });

  it("falls back to the STEPBible index when local misses", () => {
    assert.equal(getLocalLexicon("Jesus", "John 1:17"), null);
    const now = lookupWordNow("Jesus", "John 1:17");
    assert.equal(now?.strongs, "G2424");
    assert.equal(now?.source, "AS");
    assert.match(now?.citation ?? "", /G2424/);
    assert.match(now?.caution ?? "", /BDAG/);
  });

  it("misses through the committed STEPBible JSON for pocket misses", () => {
    assert.equal(getLocalLexicon("faith", "John 1:12"), null);
    const now = lookupWordNow("faith", "John 1:12");
    assert.equal(now?.strongs, "G4102");
    assert.equal(now?.source, "AS");
  });
});
