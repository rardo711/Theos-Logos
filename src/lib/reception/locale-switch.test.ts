/**
 * Focused: when the app locale switches to English, desk selection must show
 * English source text — not a sticky ES-translated cache entry.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { clearAllCached } from "./cache.ts";
import { getDeskNotes, rememberReception } from "./notes.ts";

describe("locale switch desk display", () => {
  beforeEach(() => {
    clearAllCached();
  });

  it("getDeskNotes follows locale; EN does not return cached ES bodies", () => {
    const esDesk = {
      source: "generated" as const,
      cards: [
        {
          voice: "John Gill",
          work: "Exposition",
          tradition: "reformed" as const,
          quote: "la elección de gracia",
          note: "Esta nota explica el enfoque.",
          citation: "Romans 9:11",
          source: "curated" as const,
        },
      ],
    };
    const enDesk = {
      source: "generated" as const,
      cards: [
        {
          voice: "John Gill",
          work: "Exposition",
          tradition: "reformed" as const,
          quote: "the election of grace",
          note: "This note explains the focus.",
          citation: "Romans 9:11",
          source: "curated" as const,
        },
      ],
    };

    rememberReception("ROM", 9, 11, esDesk, null, "es");
    rememberReception("ROM", 9, 11, enDesk, null, "en");

    const asEs = getDeskNotes("ROM", 9, 11, null, "es");
    const asEn = getDeskNotes("ROM", 9, 11, null, "en");

    assert.match(asEs!.cards[0].quote, /elección/);
    assert.equal(asEn!.cards[0].quote, "the election of grace");
    assert.doesNotMatch(asEn!.cards[0].quote, /elección/);
  });

  it("EN locale with only ES cache falls back to curated EN, not sticky ES", () => {
    rememberReception(
      "ROM",
      9,
      11,
      {
        source: "generated",
        cards: [
          {
            voice: "Fake Voice",
            work: "Fake",
            tradition: "reformed",
            quote: "texto solo en español pegajoso",
            citation: "x",
            source: "generated",
          },
        ],
      },
      null,
      "es",
    );

    const asEn = getDeskNotes("ROM", 9, 11, null, "en");
    // No EN cache → curated fallback or null; must not be the ES sticky quote.
    if (asEn?.cards.length) {
      assert.doesNotMatch(
        asEn.cards.map((c) => c.quote).join(" "),
        /pegajoso/,
      );
    } else {
      assert.equal(asEn, null);
    }
  });
});
