import { describe, it } from "node:test";
import assert from "node:assert/strict";
import greekJson from "./data/greek.json" with { type: "json" };
import { byStrongs } from "./data/desk.ts";
import { lookupByStrongsSync } from "./stepbible.ts";

describe("stepbible source labels", () => {
  it("greek.json carries no mislabeled src 'AS' (it is STEPBible TBESG)", () => {
    const by = greekJson as unknown as Record<string, { src?: string }>;
    const bad = Object.entries(by).filter(([, v]) => (v?.src as string) === "AS");
    assert.equal(bad.length, 0);
    const n = Object.values(by).filter((v) => v?.src === "STEPBible").length;
    assert.ok(n > 10000, `expected 10k+ STEPBible labels, got ${n}`);
  });

  it("desk.ts pocket lexicon carries no mislabeled src 'AS'", () => {
    const bad = Object.entries(byStrongs).filter(([, v]) => (v.src as string) === "AS");
    assert.equal(bad.length, 0);
  });

  it("STEPBible lookups report source STEPBible in citations", () => {
    const hit = lookupByStrongsSync("G3056");
    assert.ok(hit);
    assert.equal(hit?.source, "STEPBible");
  });
});
