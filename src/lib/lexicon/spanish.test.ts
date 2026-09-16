import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasSpanishLexiconChip,
  lookupSpanishByStrongs,
  lookupSpanishWordNow,
  spanishAttribution,
} from "./spanish.ts";

describe("spanish UBS lexicon", () => {
  it("G3056 returns Spanish UBS glosses palabra/dicho/mensaje", () => {
    const hit = lookupSpanishByStrongs("G3056");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G3056");
    assert.equal(hit?.lemma, "λόγος");
    assert.equal(hit?.gloss, "palabra");
    assert.ok(hit?.glossExtras.includes("dicho"));
    assert.ok(hit?.glossExtras.includes("mensaje"));
    assert.match(hit?.sentido ?? "", /dicho|declarado|comunicación/i);
    assert.equal(hit?.source, "ubs");
    assert.match(hit?.attribution ?? "", /CC BY-SA/);
    assert.match(spanishAttribution, /United Bible Societies|UBS/);
  });

  it("accepts zero-padded Strong's G03056", () => {
    const hit = lookupSpanishByStrongs("G03056");
    assert.equal(hit?.strongs, "G3056");
    assert.equal(hit?.gloss, "palabra");
  });

  it("Spanish surface palabra resolves to a Strong's entry", () => {
    assert.equal(hasSpanishLexiconChip("palabra"), true);
    const hit = lookupSpanishWordNow("palabra");
    assert.ok(hit);
    assert.ok(["G3056", "G2279", "G4487"].includes(hit?.strongs ?? ""));
  });

  it("excludes llm-only path: Abadón keeps UBS lexicon gloss not llm-only short", () => {
    const hit = lookupSpanishByStrongs("G3");
    assert.ok(hit);
    // UBS primary gloss (not the bare llm "Abadón" alone as sole sense without UBS)
    assert.equal(hit?.source, "ubs");
    assert.match(hit?.gloss ?? "", /Abadón/i);
    assert.match(hit?.sentido ?? "", /ángel|infierno|Destructor|hebreo/i);
  });

  it("spa short gloss is attached but hero comes from UBS Glosses", () => {
    const hit = lookupSpanishByStrongs("G3056");
    assert.equal(hit?.shortGloss, "palabra");
    assert.equal(hit?.gloss, "palabra"); // UBS first gloss
  });
});
