import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasSpanishLexiconChip,
  lookupSpanishByStrongs,
  lookupSpanishWordNow,
  referenceToSilVerseKey,
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
    assert.equal(hit?.source, "ubs");
    assert.match(hit?.gloss ?? "", /Abadón/i);
    assert.match(hit?.sentido ?? "", /ángel|infierno|Destructor|hebreo/i);
  });

  it("spa short gloss is attached but hero comes from UBS Glosses", () => {
    const hit = lookupSpanishByStrongs("G3056");
    assert.equal(hit?.shortGloss, "palabra");
    assert.equal(hit?.gloss, "palabra");
  });

  it("maps Juan/John 1:1 to SIL verse key 043001001", () => {
    assert.equal(referenceToSilVerseKey("Juan 1:1"), "043001001");
    assert.equal(referenceToSilVerseKey("John 1:1"), "043001001");
    assert.equal(referenceToSilVerseKey("Juan 1:1-3"), "043001001");
  });

  it("G746 + John 1:1 selects UBS 67.65 Tiempo / principio (not 68.1 Aspecto)", () => {
    const hit = lookupSpanishByStrongs("G746", "Juan 1:1");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G746");
    assert.equal(hit?.entryCode, "67.65");
    assert.equal(hit?.gloss, "principio");
    assert.ok(hit?.glossExtras.includes("comenzar"));
    assert.match(
      hit?.sentido ?? "",
      /punto de tiempo que indica el principio de una duración/i,
    );
    assert.equal(hit?.domains[0], "Tiempo");
    assert.match(hit?.subdomains[0] ?? "", /Principio,\s*Fin/i);
    assert.equal(hit?.senseMatchedByReference, true);
    // Without verse context, first UBS meaning is 68.1 Aspecto / empezar
    const fallback = lookupSpanishByStrongs("G746");
    assert.equal(fallback?.entryCode, "68.1");
    assert.equal(fallback?.gloss, "empezar");
    assert.equal(fallback?.domains[0], "Aspecto");
  });

  it("tap principio on Juan 1:1 resolves to G746 sense 67.65", () => {
    const hit = lookupSpanishWordNow("principio", "Juan 1:1");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G746");
    assert.equal(hit?.entryCode, "67.65");
    assert.equal(hit?.gloss, "principio");
    assert.equal(hit?.senseMatchedByReference, true);
  });

  it("Mark 1:1 G746 stays 68.1 Aspecto (empezar), not John Tiempo", () => {
    const hit = lookupSpanishByStrongs("G746", "Marcos 1:1");
    assert.equal(hit?.entryCode, "68.1");
    assert.equal(hit?.gloss, "empezar");
    assert.equal(hit?.domains[0], "Aspecto");
    assert.equal(hit?.senseMatchedByReference, true);
  });

  it("G3956 + Juan 1:3 selects totality sense (todas) with related senses", () => {
    const hit = lookupSpanishByStrongs("G3956", "Juan 1:3");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G3956");
    assert.equal(hit?.gloss, "todas");
    assert.equal(hit?.entryCode, "59.23");
    assert.equal(hit?.senseMatchedByReference, true);
    assert.ok((hit?.relatedSenseCount ?? 0) >= 1);
    assert.equal(hit?.relatedSenseCount, (hit?.senses.length ?? 0) - 1);
    assert.match(hit?.sentido ?? "", /totalidad/i);
    assert.equal(hit?.domains[0], "Cantidad");
  });

  it("tap todas on Juan 1:3 resolves to G3956 sense 59.23", () => {
    const hit = lookupSpanishWordNow("todas", "Juan 1:3");
    assert.ok(hit);
    assert.equal(hit?.strongs, "G3956");
    assert.equal(hit?.entryCode, "59.23");
    assert.equal(hit?.gloss, "todas");
    assert.equal(hit?.senseMatchedByReference, true);
  });
});
