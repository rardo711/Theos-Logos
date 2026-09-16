/**
 * Client curated desks show English quote until server NMT returns.
 * mergeReceptionCards must prefer incoming (translated) bodies for same cite.
 */
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { clearAllCached, getCached } from "./cache.ts";
import {
  getDeskNotes,
  isUncachedCuratedDesk,
  mergeReceptionCards,
} from "./notes.ts";
import type { SourceCard } from "../bible/types.ts";

function card(
  partial: Partial<SourceCard> & Pick<SourceCard, "voice" | "quote" | "citation">,
): SourceCard {
  return {
    work: "Tractates on John",
    tradition: "patristic",
    source: "curated",
    ...partial,
  };
}

describe("mergeReceptionCards", () => {
  it("replaces English curated quote with incoming ES NMT for same cite", () => {
    const prior = [
      card({
        voice: "Augustine",
        citation: "NPNF 1/7, Tractate 1 on John",
        quote:
          "What was made, in Him was life. The Word is not merely the artisan of creatures; He is their life, and that life is our light.",
      }),
    ];
    const incoming = [
      card({
        voice: "Augustine",
        citation: "NPNF 1/7, Tractate 1 on John",
        quote:
          "Lo que fue hecho, en Él estaba la vida. El Verbo no es meramente el artífice de las criaturas; Él es su vida, y esa vida es nuestra luz.",
      }),
      card({
        voice: "John Calvin",
        citation: "Calvin, Comm. John 1:5",
        quote: "La luz no se extingue aunque el mundo esté ciego.",
        source: "generated",
        work: "Commentary on John 1:5",
        tradition: "reformed",
      }),
    ];

    const { cards, addedCount } = mergeReceptionCards(prior, incoming);
    assert.equal(addedCount, 1);
    assert.match(cards[0].quote, /él estaba la vida|Él estaba la vida|vida/i);
    assert.doesNotMatch(cards[0].quote, /What was made/);
    assert.equal(cards[1].voice, "John Calvin");
  });

  it("returns incoming wholesale when prior is empty", () => {
    const incoming = [
      card({ voice: "Augustine", citation: "x", quote: "hola" }),
    ];
    const { cards, addedCount } = mergeReceptionCards([], incoming);
    assert.equal(addedCount, 1);
    assert.equal(cards[0].quote, "hola");
  });
});

describe("uncached curated desk (Juan 1:4)", () => {
  beforeEach(() => {
    clearAllCached();
  });

  it("getDeskNotes locale=es without cache returns English curated quote", () => {
    const desk = getDeskNotes("JHN", 1, 4, null, "es");
    assert.ok(desk?.cards.length);
    const augustine = desk!.cards.find((c) => c.voice === "Augustine");
    assert.ok(augustine);
    assert.match(augustine!.quote, /What was made, in Him was life/);
    assert.equal(
      isUncachedCuratedDesk("JHN", 1, 4, null, "es", desk),
      true,
      "client must trigger server NMT — localizeCard does not touch quote",
    );
  });

  it("range Juan 1:4–7 curated stack still English until NMT cache", () => {
    const desk = getDeskNotes("JHN", 1, 4, 7, "es");
    assert.ok(desk?.cards.length, "range must surface curated cards");
    const blob = desk!.cards.map((c) => c.quote).join(" ");
    assert.match(blob, /What was made|The light shines|life/i);
    assert.equal(isUncachedCuratedDesk("JHN", 1, 4, 7, "es", desk), true);
    assert.equal(getCached("JHN", 1, 4, 7, "es"), null);
  });

  it("EN locale restores English curated (no sticky ES)", () => {
    const en = getDeskNotes("JHN", 1, 4, null, "en");
    assert.match(
      en!.cards.find((c) => c.voice === "Augustine")!.quote,
      /What was made, in Him was life/,
    );
  });
});
