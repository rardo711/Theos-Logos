import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { clearTranslationMemory } from "./cache.ts";
import { clearSaTokenCache, googleTranslateHtml } from "./google-nmt.ts";

describe("googleTranslateHtml", () => {
  const realFetch = globalThis.fetch;
  let calls: Array<{ url: string; body: unknown }> = [];

  beforeEach(() => {
    calls = [];
    clearTranslationMemory();
    clearSaTokenCache();
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
  });

  afterEach(() => {
    globalThis.fetch = realFetch;
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
    delete process.env.GOOGLE_APPLICATION_CREDENTIALS;
  });

  it("returns null when credentials are missing", async () => {
    const out = await googleTranslateHtml({
      htmlParts: ["Hello"],
      target: "es",
    });
    assert.equal(out, null);
    assert.equal(calls.length, 0);
  });

  it("posts HTML batches with API key and returns translations", async () => {
    process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });
      assert.match(url, /key=test-key/);
      return new Response(
        JSON.stringify({
          data: {
            translations: [
              { translatedText: "Hola <span class=\"notranslate\" translate=\"no\">Romans 9:11</span>" },
            ],
          },
        }),
        { status: 200 },
      );
    }) as typeof fetch;

    const out = await googleTranslateHtml({
      htmlParts: ['Hello <span class="notranslate" translate="no">Romans 9:11</span>'],
      target: "es",
    });
    assert.deepEqual(out, [
      'Hola <span class="notranslate" translate="no">Romans 9:11</span>',
    ]);
    assert.equal(calls.length, 1);
    assert.equal((calls[0].body as { format: string }).format, "html");
    assert.equal((calls[0].body as { target: string }).target, "es");
  });

  it("returns null on API error (EN fallback path)", async () => {
    process.env.GOOGLE_TRANSLATE_API_KEY = "test-key";
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ error: { message: "quota" } }), {
        status: 403,
      })) as typeof fetch;
    const out = await googleTranslateHtml({ htmlParts: ["Hi"], target: "es" });
    assert.equal(out, null);
  });
});
