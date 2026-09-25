import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseSynthesis,
  synthesistSystem,
  synthesistUser,
  firstUnverifiableSpan,
} from "./synthesize.ts";
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

  it("accepts an answer that quotes a card's HTML entities as decoded characters", () => {
    // Extracted cards can carry the source page's entities verbatim
    // (&#x3ba;...); the model quotes the Greek they encode, possibly in the
    // precomposed unicode form where the entities spell a decomposed one.
    // Rejecting that mismatch blanked the Summary panel on John 3:16.
    const entityCard: SourceCard = {
      voice: "Marvin Vincent",
      work: "Word Studies",
      tradition: "reformed",
      quote:
        "The term world (&#x3ba;&#x3bf;&#769;&#x3c3;&#x3bc;&#x3bf;&#x3bd;) refers not to all human individuals.",
      citation: "Vincent, Word Studies",
      source: "generated",
    };
    const raw = JSON.stringify({
      answer:
        "Vincent limits the scope: \u201cthe term world (\u03ba\u03cc\u03c3\u03bc\u03bf\u03bd) refers not to all human individuals.\u201d",
      cited: ["Marvin Vincent"],
      quotes: [],
    });
    const parsed = parseSynthesis(raw, [entityCard], "q");
    assert.ok(parsed);
    assert.match(parsed.answer, /Vincent limits the scope/);
  });
});

describe("firstUnverifiableSpan", () => {
  it("names the span that fails the desk check, null when all verify", () => {
    const bad = firstUnverifiableSpan(
      'Augustine says "the Word was a created being of the highest order".',
      [card],
    );
    assert.match(bad ?? "", /created being/);
    assert.equal(
      firstUnverifiableSpan(
        'Augustine reads "In the beginning was the Word" as naming God.',
        [card],
      ),
      null,
    );
  });
});
describe("synthesistSystem", () => {
  it("asks for a short direct answer for explicit questions, paragraphs for summaries", () => {
    assert.match(
      synthesistSystem("en", { brief: true }),
      /one or two short sentences/,
    );
    assert.match(synthesistSystem("en"), /short paragraphs/);
    assert.match(
      synthesistSystem("es", { brief: true }),
      /one or two short sentences/,
    );
  });
});

describe("off-verse redirect", () => {
  it("tells the model to decline or redirect questions outside the passage", () => {
    for (const sys of [
      synthesistSystem("en", { brief: true }),
      synthesistSystem("en", { brief: true, noCards: true }),
      synthesistSystem("es", { brief: true, noCards: true }),
    ]) {
      assert.match(sys, /not about this verse/);
      assert.match(sys, /using Search/);
    }
  });
});

describe("verse-only answers (no desk cards)", () => {
  const verse = "For God so loved the world that he gave his only Son.";
  it("prompts from the verse text alone and names the honesty rule", () => {
    const sys = synthesistSystem("en", { brief: true, noCards: true });
    assert.match(sys, /no commentary cards on the desk/);
    assert.match(sys, /exact substring of the verse text/);
    assert.match(sys, /cannot answer the inquiry/);
    assert.match(sys, /one or two short sentences/);
  });
  it("marks the empty desk in the user message", () => {
    const user = synthesistUser({
      reference: "John 3:16",
      verseText: verse,
      question: "What does 'world' mean?",
      cards: [],
      locale: "en",
    });
    assert.match(user, /\(none/);
  });
  it("grounds quoted spans in the verse text when no cards exist", () => {
    assert.equal(
      firstUnverifiableSpan('It says "For God so loved the world" plainly.', [], verse),
      null,
    );
    const bad = firstUnverifiableSpan(
      'Augustine says "the Word was a created being of the highest order".',
      [],
      verse,
    );
    assert.match(bad ?? "", /created being/);
  });
  it("parseSynthesis accepts a verse-grounded answer with no cards", () => {
    const raw = JSON.stringify({
      answer: 'The verse says "For God so loved the world", so the love is directed outward.',
      cited: [],
      quotes: [],
    });
    const parsed = parseSynthesis(raw, [], "q", verse);
    assert.ok(parsed);
  });
});
