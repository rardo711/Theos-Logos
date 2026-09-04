import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { splitDropCap } from "./drop-cap.ts";

describe("splitDropCap", () => {
  it("splits a Latin opening verse", () => {
    assert.deepEqual(splitDropCap("In the beginning was the Word."), {
      letter: "I",
      rest: "n the beginning was the Word.",
    });
  });

  it("splits a Spanish opening verse", () => {
    assert.deepEqual(splitDropCap("En el principio era el Verbo."), {
      letter: "E",
      rest: "n el principio era el Verbo.",
    });
  });

  it("keeps a single-letter verse as the drop", () => {
    assert.deepEqual(splitDropCap("O"), { letter: "O", rest: "" });
  });

  it("returns null for empty or non-letter starts", () => {
    assert.equal(splitDropCap(""), null);
    assert.equal(splitDropCap("1 In the beginning"), null);
    assert.equal(splitDropCap("“In the beginning"), null);
  });
});
