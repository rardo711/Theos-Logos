import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseSynthesis } from "./synthesize.ts";
import type { SourceCard } from "../bible/types.ts";

const card: SourceCard = {
  voice: "Augustine",
  work: "Tractates on John",
  tradition: "western-patristic",
  quote: "In the beginning was the Word, and the Word was with God.",
  citation: "Tractate 1",
  source: "curated",
};

describe("parseSynthesis", () => {
  it("accepts an answer that quotes a desk card verbatim", () => {
    const raw = JSON.stringify({
      answer: "Augustine reads the verse as naming the Word with God.",
      cited: ["Augustine"],
      quotes: [
        {
          voice: "Augustine",
          quote: "the Word was with God",
        },
      ],
    });
    const parsed = parseSynthesis(raw, [card], "what does this mean");
    assert.ok(parsed);
    assert.equal(parsed?.cited[0], "Augustine");
  });

  it("rejects a quote that is not on the desk", () => {
    const raw = JSON.stringify({
      answer: "Invented.",
      cited: ["Augustine"],
      quotes: [{ voice: "Augustine", quote: "This sentence is not on the card." }],
    });
    assert.equal(parseSynthesis(raw, [card], "q"), null);
  });
});
