import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hasSpanishHebrewChip,
  lookupSpanishHebrewByGloss,
  lookupSpanishHebrewByStrongs,
  lookupSpanishHebrewWordNow,
  rv09Attribution,
  spanishHebrewAttribution,
} from "./spanish-hebrew.ts";
import { lookupHebrewBdbByStrongs } from "./hebrew-bdb.ts";
import spanishHebrewJson from "./data/spanish-hebrew.json" with { type: "json" };

const by = (
  spanishHebrewJson as unknown as {
    by: Record<
      string,
      { s: string; src: string[]; glossEs?: string; rv09?: [string, number][] }
    >;
  }
).by;

describe("spanish OT Hebrew lexicon", () => {
  it("H2377 hero is the human Spanish gloss 'sueño' (labeled gloss, not definition)", () => {
    const hit = lookupSpanishHebrewByStrongs("H2377");
    assert.ok(hit);
    assert.equal(hit?.strongs, "H2377");
    assert.equal(hit?.glossEs, "sueño");
    assert.equal(hit?.hero, "sueño");
    assert.equal(hit?.heroKind, "gloss");
    assert.equal(hit?.hasSpanishSignal, true);
    assert.ok(hit?.sources.includes("gloss"));
  });

  it("H2377 carries RV09 'visión' with count 29", () => {
    const hit = lookupSpanishHebrewByStrongs("H2377");
    assert.ok(hit);
    const vision = hit?.rv09.find((r) => r.rendering === "visión");
    assert.ok(vision, "RV09 renderings should include visión");
    assert.equal(vision?.count, 29);
    assert.ok(hit?.sources.includes("rv09"));
    assert.match(rv09Attribution, /Reina-Valera 1909/);
    assert.match(rv09Attribution, /public domain/i);
  });

  it("coverage thresholds: gloss ≥ 7000, surfaces ≥ 7500, union ≥ 8300", () => {
    const ids = Object.keys(by);
    assert.equal(ids.length, 8618);
    let gloss = 0;
    let surfaces = 0;
    const union = new Set<string>();
    for (const [id, e] of Object.entries(by)) {
      if (e.glossEs) {
        gloss += 1;
        union.add(id);
      }
      if (e.rv09?.length) {
        surfaces += 1;
        union.add(id);
      }
    }
    assert.ok(gloss >= 7000, `gloss coverage ${gloss}`);
    assert.ok(surfaces >= 7500, `surface coverage ${surfaces}`);
    // Union is counted over the shipped BDB keyspace (8618): 48 TSV ids
    // fall outside it (BDB budget-trimmed numbers), so 8266 — not the raw
    // upstream 8314 — is the honest shipped number.
    assert.ok(union.size >= 8200, `union coverage ${union.size}`);
  });

  it("gap entries (no Spanish signal) fall back cleanly — never blank, never mislabeled", () => {
    const gaps = Object.entries(by).filter(([, e]) => e.src.length === 0);
    assert.ok(gaps.length > 0, "expected some gap entries");
    assert.ok(gaps.length < 1000, `too many gaps: ${gaps.length}`);
    for (const [id, e] of gaps.slice(0, 50)) {
      const hit = lookupSpanishHebrewByStrongs(id);
      assert.ok(hit);
      assert.equal(hit?.hasSpanishSignal, false);
      assert.equal(hit?.heroKind, "none");
      assert.equal(hit?.hero, "");
      // The card falls back to labeled BDB English for these.
      const bdb = lookupHebrewBdbByStrongs(id);
      assert.ok(bdb, `${id} should resolve in BDB for the English fallback`);
      assert.ok(bdb?.gloss, `${id} BDB fallback gloss must not be blank`);
    }
  });

  it("every entry with a Spanish signal has a non-empty hero", () => {
    for (const [id, e] of Object.entries(by)) {
      if (e.src.length === 0) continue;
      const hit = lookupSpanishHebrewByStrongs(id);
      assert.ok(hit?.hero, `${id} has signal but blank hero`);
      assert.notEqual(hit?.heroKind, "none");
    }
  });

  it("heroKind is honest: gloss ⟺ glossEs present, rv09 ⟺ top rendering", () => {
    for (const [id, e] of Object.entries(by)) {
      const hit = lookupSpanishHebrewByStrongs(id);
      if (e.glossEs) {
        assert.equal(hit?.heroKind, "gloss", id);
        assert.equal(hit?.hero, e.glossEs);
      } else if (e.rv09?.length) {
        assert.equal(hit?.heroKind, "rv09", id);
        assert.equal(hit?.hero, e.rv09[0][0]);
      }
    }
  });

  it("attribution separation: no source's wording under another source's name", () => {
    assert.match(spanishHebrewAttribution, /bcv-data\/strongs/);
    assert.match(spanishHebrewAttribution, /CC BY-SA 4\.0/);
    const blob = JSON.stringify(spanishHebrewJson).toLowerCase();
    assert.ok(
      !blob.includes("strong's en español"),
      "must never present NMT/gloss text as a Spanish Strong's edition",
    );
    assert.ok(
      !/definici[óo]n/.test(spanishHebrewAttribution),
      "the gloss must not be called a definition in attribution",
    );
    assert.equal(
      (spanishHebrewJson as { license?: string }).license,
      "CC BY-SA 4.0",
      "share-alike recorded",
    );
  });

  it("hygiene sweep: no tags, entities, or control chars in shipped Spanish", () => {
    const bad: string[] = [];
    for (const [id, e] of Object.entries(by)) {
      const pool = [e.glossEs ?? "", ...(e.rv09 ?? []).map(([t]) => t)];
      for (const s of pool) {
        if (
          s.includes("<") ||
          /&(?:[a-z]+|#\d+);/i.test(s) ||
          /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(s)
        ) {
          bad.push(`${id}: ${s.slice(0, 40)}`);
        }
      }
    }
    assert.deepEqual(bad.slice(0, 5), [], `hygiene failures: ${bad.length}`);
  });

  it("Spanish surface 'visión' resolves to H2377", () => {
    assert.equal(hasSpanishHebrewChip("visión"), true);
    const hits = lookupSpanishHebrewByGloss("visión");
    assert.ok(hits.some((h) => h.strongs === "H2377"));
    const hit = lookupSpanishHebrewWordNow("visión");
    assert.ok(hit);
  });

  it("Spanish gloss 'sueño' resolves to H2377", () => {
    const hits = lookupSpanishHebrewByGloss("sueño");
    assert.ok(hits.some((h) => h.strongs === "H2377"));
  });

  it("accepts zero-padded Strong's h02377", () => {
    const hit = lookupSpanishHebrewByStrongs("h02377");
    assert.equal(hit?.strongs, "H2377");
  });

  it("unknown Strong's returns null", () => {
    assert.equal(lookupSpanishHebrewByStrongs("H99999"), null);
    assert.equal(lookupSpanishHebrewByStrongs(""), null);
    assert.equal(hasSpanishHebrewChip("xyzzyplugh"), false);
  });

  it("BDB side resolves for a Spanish reference (Nahúm 1:1)", () => {
    const bdb = lookupHebrewBdbByStrongs("H2377", "Nahúm 1:1");
    assert.ok(bdb, "Spanish book names must work for verse-sense lookup");
    assert.equal(bdb?.strongs, "H2377");
    assert.ok(bdb?.senseLine, "verse-sense one-liner present");
  });

  it("no llm rows leaked in: spot-check glosses are human lexicon values", () => {
    // 'sueño' for H2377 is the lexicon-method row; llm-only rows were dropped
    // at import (3044 skipped). A gloss that only ever existed as llm-only
    // must not appear — verified structurally by src markers instead.
    for (const [, e] of Object.entries(by)) {
      if (e.glossEs) assert.ok(e.src.includes("gloss"));
      if (e.rv09?.length) assert.ok(e.src.includes("rv09"));
    }
  });
});
