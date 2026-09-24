import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_EN_TRANSLATION,
  DEFAULT_ES_TRANSLATION,
  isEnTranslationId,
  isEsTranslationId,
  translationInfo,
  translationsFor,
} from "./translations.ts";

describe("translations registry", () => {
  it("lists the English translations with ESV default", () => {
    const ids = translationsFor("en").map((t) => t.id);
    assert.deepEqual(ids, ["esv", "kjv", "asv", "web"]);
    assert.equal(DEFAULT_EN_TRANSLATION, "esv");
  });

  it("lists Reina Valera Gómez as the Spanish default", () => {
    const ids = translationsFor("es").map((t) => t.id);
    assert.deepEqual(ids, ["rv2004"]);
    assert.equal(DEFAULT_ES_TRANSLATION, "rv2004");
  });

  it("falls back to the locale default on unknown ids", () => {
    assert.equal(translationInfo("en", "nope").id, "esv");
    assert.equal(translationInfo("es", "nope").id, "rv2004");
    assert.equal(translationInfo("en", undefined).id, "esv");
  });

  it("resolves KJV/ASV through the bolls pipe", () => {
    assert.equal(translationInfo("en", "kjv").bollsSlug, "KJV");
    assert.equal(translationInfo("en", "asv").bollsSlug, "ASV");
    assert.equal(translationInfo("en", "kjv").name, "King James Version");
  });

  it("validates translation ids", () => {
    assert.ok(isEnTranslationId("kjv"));
    assert.ok(!isEnTranslationId("rv2004"));
    assert.ok(isEsTranslationId("rv2004"));
    assert.ok(!isEsTranslationId("kjv"));
  });
});
