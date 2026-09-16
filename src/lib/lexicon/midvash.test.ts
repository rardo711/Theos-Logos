import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseStrongsId, strongsMidvashHref } from "./midvash.ts";

describe("strongsMidvashHref", () => {
  it("ES Greek G3956 → midvash es griego g3956", () => {
    assert.equal(
      strongsMidvashHref("G3956", "es"),
      "https://midvash.com/es/concordancia-strong/griego/g3956",
    );
  });

  it("strips leading zeros G03956 → g3956", () => {
    assert.equal(
      strongsMidvashHref("G03956", "es"),
      "https://midvash.com/es/concordancia-strong/griego/g3956",
    );
  });

  it("EN Greek prefers Midvash EN path", () => {
    assert.equal(
      strongsMidvashHref("G3956", "en"),
      "https://midvash.com/strongs-concordance/greek/g3956",
    );
  });

  it("ES Hebrew H7225 → hebreo h7225", () => {
    assert.equal(
      strongsMidvashHref("H7225", "es"),
      "https://midvash.com/es/concordancia-strong/hebreo/h7225",
    );
  });

  it("EN Hebrew H7225 → hebrew h7225", () => {
    assert.equal(
      strongsMidvashHref("H430", "en"),
      "https://midvash.com/strongs-concordance/hebrew/h430",
    );
  });

  it("parseStrongsId distinguishes G vs H", () => {
    assert.deepEqual(parseStrongsId("G25"), { lang: "greek", n: "25" });
    assert.deepEqual(parseStrongsId("H7225"), { lang: "hebrew", n: "7225" });
  });
});
