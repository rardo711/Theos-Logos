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
  it("John 1 Word is STEPBible G3056 (no global Johannine local leak)", () => {
    // Johannine student notes no longer apply to every NT tap.
    assert.equal(getLocalLexicon("Word", "John 1:1"), null);
    const now = lookupWordNow("Word", "John 1:1");
    assert.equal(now?.strongs, "G3056");
    assert.equal(now?.source, "STEPBible");
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
      assert.equal(hit?.source, "STEPBible");
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
    assert.equal(now?.source, "STEPBible");
    assert.match(now?.citation ?? "", /G2424/);
    assert.match(now?.caution ?? "", /BDAG/);
  });

  it("STEPBible cards lead with the brief gloss, not raw __ markers", () => {
    const now = lookupWordNow("faith", "John 1:12");
    assert.equal(now?.strongs, "G4102");
    assert.equal(now?.gloss.includes("__"), false);
    assert.match(now?.gloss ?? "", /faith/i);
    assert.equal((now?.range ?? "").includes("__"), false);
  });


  it("Romans 8:28 love is G25 ἀγαπάω, not G26 noun", () => {
    const local = getLocalLexicon("love", "Romans 8:28");
    const now = lookupWordNow("love", "Romans 8:28");
    assert.ok(local);
    assert.equal(local?.strongs, "G25");
    assert.equal(local?.lemma, "ἀγαπάω");
    assert.equal(now?.strongs, "G25");
    assert.equal(now?.lemma, "ἀγαπάω");
    // Noun verses stay on the STEPBible gloss path (G26) — no global love override.
    assert.equal(getLocalLexicon("love", "Romans 8:35"), null);
    assert.equal(lookupWordNow("love", "Romans 8:35")?.strongs, "G26");
  });

  it("Hebrews 1:1 spoke is G2980 λαλέω, not H2839 wheel spoke", () => {
    const local = getLocalLexicon("spoke", "Hebrews 1:1");
    const now = lookupWordNow("spoke", "Hebrews 1:1");
    assert.ok(local);
    assert.equal(local?.strongs, "G2980");
    assert.equal(local?.lemma, "λαλέω");
    assert.equal(now?.strongs, "G2980");
    assert.equal(now?.lemma, "λαλέω");
    // Unscoped English "spoke" still hits the STEPBible gloss noun (H2839) — no global override.
    assert.equal(getLocalLexicon("spoke"), null);
    assert.equal(lookupWordNow("spoke")?.strongs, "H2839");
  });

  it("Romans 8:28 God stays G2316; Mark 1:1 beginning stays G746", () => {
    assert.equal(lookupWordNow("God", "Romans 8:28")?.strongs, "G2316");
    assert.equal(lookupWordNow("beginning", "Mark 1:1")?.strongs, "G746");
    assert.equal(lookupWordNow("beginning", "Mark 1:1")?.lemma, "ἀρχή");
  });

  it("misses through the committed STEPBible JSON for pocket misses", () => {
    assert.equal(getLocalLexicon("faith", "John 1:12"), null);
    const now = lookupWordNow("faith", "John 1:12");
    assert.equal(now?.strongs, "G4102");
    assert.equal(now?.source, "STEPBible");
  });
});
