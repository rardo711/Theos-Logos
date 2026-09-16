import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasHebrewBdbChip,
  hebrewBdbAttribution,
  lookupHebrewBdbByGloss,
  lookupHebrewBdbByStrongs,
  lookupHebrewBdbWordNow,
} from "./hebrew-bdb.ts";

describe("hebrew BDB lexicon", () => {
  it("H7225 returns BDB beginning/chief", () => {
    const hit = lookupHebrewBdbByStrongs("H7225");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H7225");
    assert.equal(hit?.lemma, "רֵאשִׁית");
    assert.match(hit?.gloss ?? "", /beginning/i);
    assert.match(hit?.attribution ?? "", /Brown-Driver-Briggs/);
    assert.match(hebrewBdbAttribution, /Brown-Driver-Briggs/);
    assert.equal(hit?.isAramaic, false);
  });

  it("H1254 is create (I), not be fat (II)", () => {
    const hit = lookupHebrewBdbByStrongs("H1254");
    assert.ok(hit);
    assert.equal(hit?.lemma, "בָּרָא");
    assert.match(hit?.gloss ?? "", /create/i);
    assert.ok((hit?.senses ?? []).length > 5);
  });

  it("H430 is elohim (God), not halal", () => {
    const hit = lookupHebrewBdbByStrongs("H430");
    assert.ok(hit);
    assert.equal(hit?.lemma, "אֱלֹהִים");
    // BDB's first sense block glosses it "rulers, judges"; "God" appears in
    // the fuller sense glosses below.
    assert.equal(hit?.gloss, "rulers, judges");
    assert.ok(
      (hit?.senses ?? []).some((s) =>
        s.glosses.some((g) => /god/i.test(g)),
      ),
    );
  });

  it("H216 is light", () => {
    const hit = lookupHebrewBdbByStrongs("H216");
    assert.ok(hit);
    assert.equal(hit?.lemma, "אוֺר");
    assert.match(hit?.gloss ?? "", /light/i);
  });

  it("H1254 + Genesis 2:4 selects the Niphal 'be created' sense by verse", () => {
    const hit = lookupHebrewBdbByStrongs("H1254", "Genesis 2:4");
    assert.ok(hit);
    assert.equal(hit?.senseMatchedByReference, true);
    assert.equal(hit?.selectedSenseIndex, 6);
    assert.match(hit?.sense ?? "", /be created/i);
    assert.equal(hit?.senses[6]?.matchedByReference, true);
  });

  it("H1254 without a verse falls back to the head block", () => {
    const hit = lookupHebrewBdbByStrongs("H1254");
    assert.ok(hit);
    assert.equal(hit?.senseMatchedByReference, false);
    assert.equal(hit?.selectedSenseIndex, 0);
  });

  it("surface 'love' resolves to H157 (aheb)", () => {
    assert.equal(hasHebrewBdbChip("love"), true);
    const hit = lookupHebrewBdbWordNow("love");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H157");
    assert.equal(hit?.lemma, "אָהֵב");
  });

  it("accepts zero-padded Strong's H0430", () => {
    const hit = lookupHebrewBdbByStrongs("H0430");
    assert.equal(hit?.strongs, "H430");
    assert.equal(hit?.lemma, "אֱלֹהִים");
  });

  it("unknown Strong's returns null", () => {
    assert.equal(lookupHebrewBdbByStrongs("H99999"), null);
    assert.equal(lookupHebrewBdbByStrongs(""), null);
    assert.equal(hasHebrewBdbChip("xyzzyplugh"), false);
  });

  it("H2 is flagged Biblical Aramaic", () => {
    const hit = lookupHebrewBdbByStrongs("H2");
    assert.ok(hit);
    assert.equal(hit?.isAramaic, true);
    // BDB's Aramaic headword is אַב (the Hebrew cognate אָב is a cross-ref).
    assert.equal(hit?.lemma, "אַב");
  });

  it("gloss lookup returns Strong's ids for 'light'", () => {
    const hits = lookupHebrewBdbByGloss("light");
    assert.ok(hits.length > 0);
    assert.ok(hits.some((h) => h.strongs === "H216"));
  });
});
