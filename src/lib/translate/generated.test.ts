import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import type { SourceCard } from "../bible/types.ts";
import { clearTranslationMemory } from "./cache.ts";
import { clearSaTokenCache } from "./google-nmt.ts";
import {
  translateGeneratedCard,
  translateGeneratedReception,
  translateSynthesisQuotes,
} from "./generated.ts";

function gen(partial: Partial<SourceCard> & Pick<SourceCard, "quote">): SourceCard {
  return {
    voice: "John Calvin",
    work: "Commentary on Romans",
    tradition: "reformed",
    citation: "Romans 9:11 · https://example.com",
    source: "generated",
    grounded: true,
    ...partial,
  };
}

describe("translateGeneratedCard", () => {
  const realFetch = globalThis.fetch;

  beforeEach(() => {
    clearTranslationMemory();
    clearSaTokenCache();
    process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";
    globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? "{}")) as { q: string[] };
      return new Response(
        JSON.stringify({
          data: {
            translations: body.q.map((q) => ({
              translatedText: q
                .replace(/In the beginning was the Word/g, "En el principio era el Verbo")
                .replace(/election of grace/g, "elección de gracia")
                .replace(/This note explains the focus\./g, "Esta nota explica el enfoque."),
            })),
          },
        }),
        { status: 200 },
      );
    }) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = realFetch;
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
  });

  it("translates generated quote and bridge; leaves curated alone", async () => {
    const generated = gen({
      quote: "the election of grace",
      contextBridge: "This note explains the focus.",
    });
    const curated: SourceCard = {
      ...generated,
      source: "curated",
      quote: "the election of grace",
    };

    const outGen = await translateGeneratedCard(generated, { locale: "es" });
    assert.match(outGen.quote, /elección de gracia/);
    assert.match(String(outGen.contextBridge), /Esta nota/);

    const outCur = await translateGeneratedCard(curated, { locale: "es" });
    assert.equal(outCur.quote, "the election of grace");
  });

  it("uses Spanish scripture when quote is the English verse", async () => {
    const en = "In the beginning was the Word";
    const es = "En el principio era el Verbo";
    const card = gen({ quote: en });
    const out = await translateGeneratedCard(card, {
      locale: "es",
      verseTextEn: en,
      verseTextEs: es,
    });
    assert.equal(out.quote, es);
  });

  it("skips NMT when locale is en", async () => {
    const card = gen({ quote: "the election of grace" });
    const out = await translateGeneratedCard(card, { locale: "en" });
    assert.equal(out.quote, "the election of grace");
  });

  it("falls back to English when API key missing", async () => {
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
    const card = gen({ quote: "the election of grace" });
    const out = await translateGeneratedCard(card, { locale: "es" });
    assert.equal(out.quote, "the election of grace");
  });
});

describe("translateGeneratedReception", () => {
  beforeEach(() => {
    clearTranslationMemory();
    process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";
    globalThis.fetch = (async (_i: RequestInfo | URL, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? "{}")) as { q: string[] };
      return new Response(
        JSON.stringify({
          data: {
            translations: body.q.map((q) => ({
              translatedText: q.replace(/grace/g, "gracia"),
            })),
          },
        }),
        { status: 200 },
      );
    }) as typeof fetch;
  });

  afterEach(() => {
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
  });

  it("only mutates generated cards in a mixed desk", async () => {
    const result = await translateGeneratedReception(
      {
        source: "generated",
        cards: [
          gen({ quote: "grace alone", voice: "Gemini Extract" }),
          {
            voice: "Augustine",
            work: "Enchiridion",
            tradition: "patristic",
            quote: "grace alone",
            citation: "§98",
            source: "curated",
          },
        ],
      },
      { locale: "es" },
    );
    assert.match(result.cards[0].quote, /gracia/);
    assert.equal(result.cards[1].quote, "grace alone");
  });
});

describe("translateSynthesisQuotes", () => {
  beforeEach(() => {
    clearTranslationMemory();
    process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";
    globalThis.fetch = (async (_i: RequestInfo | URL, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? "{}")) as { q: string[] };
      return new Response(
        JSON.stringify({
          data: {
            translations: body.q.map((q) => ({
              translatedText: q.replace(
                /the vessels of wrath/g,
                "los vasos de ira",
              ),
            })),
          },
        }),
        { status: 200 },
      );
    }) as typeof fetch;
  });

  afterEach(() => {
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
  });

  it("translates long English quoted spans in the answer", async () => {
    const out = await translateSynthesisQuotes(
      {
        question: "¿Qué dice?",
        answer:
          'Calvino habla de "the vessels of wrath prepared for destruction" en este versículo.',
        cited: ["John Calvin"],
      },
      { locale: "es" },
    );
    assert.match(out.answer, /los vasos de ira/);
    assert.doesNotMatch(out.answer, /the vessels of wrath/);
  });
});

