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

  it("rejects a fabricated quotation in the answer the reader sees", () => {
    const raw = JSON.stringify({
      answer:
        'Augustine writes that "the will of man is powerless until grace has first moved it toward God."',
      cited: ["Augustine"],
      quotes: [],
    });
    assert.equal(parseSynthesis(raw, [card], "q"), null);
  });

  it("accepts an answer that quotes the verse under discussion", () => {
    // Romans 9:16 in the panel: the reader asked how the verse can be
    // understood, and the natural answer quotes the verse. That is not a
    // fabrication, and rejecting it left the desk silent with good cards on it.
    const verse =
      "So then it depends not on human will or exertion, but on God, who has mercy.";
    const raw = JSON.stringify({
      answer:
        'The clause "it depends not on human will or exertion, but on God, who has mercy" is where the sources divide.',
      cited: ["Augustine"],
      quotes: [],
    });
    assert.ok(parseSynthesis(raw, [card], "q", verse));
    // Without the verse in the haystack this is the false rejection that was
    // reaching the screen as "could not be verified".
    assert.equal(parseSynthesis(raw, [card], "q"), null);
  });

  it("keeps a sound answer when an unrendered quotes[] entry fails", () => {
    // quotes[] is metadata and never reaches the reader. One bad entry used to
    // discard the whole synthesis.
    const raw = JSON.stringify({
      answer: "Augustine reads the verse as naming the Word with God.",
      cited: ["Augustine"],
      quotes: [{ voice: "Augustine", quote: "A sentence that is not on the card at all." }],
    });
    const parsed = parseSynthesis(raw, [card], "q");
    assert.ok(parsed);
    assert.match(parsed.answer, /naming the Word with God/);
  });

  it("leaves short quoted phrases unchecked", () => {
    const raw = JSON.stringify({
      answer: 'The term "mercy" carries the weight here.',
      cited: ["Augustine"],
      quotes: [],
    });
    assert.ok(parseSynthesis(raw, [card], "q"));
  });

  it("still rejects an empty answer", () => {
    assert.equal(
      parseSynthesis(JSON.stringify({ answer: "", cited: [], quotes: [] }), [card], "q"),
      null,
    );
  });
});
