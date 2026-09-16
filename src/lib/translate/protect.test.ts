import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isPrimarilyScripture,
  protectForTranslate,
  unwrapProtected,
} from "./protect.ts";

describe("protectForTranslate", () => {
  it("wraps verse refs, Strong's, Greek, and voice names", () => {
    const { html, tokens } = protectForTranslate(
      'Calvin on Romans 9:11 says ἐκλογή (G1589) about election.',
      ["Calvin"],
    );
    assert.match(html, /notranslate/);
    assert.ok(tokens.some((t) => /Romans 9:11/i.test(t)));
    assert.ok(tokens.some((t) => t === "G1589"));
    assert.ok(tokens.some((t) => t.includes("ἐκλογή")));
    assert.ok(tokens.some((t) => t === "Calvin"));
  });

  it("round-trips unwrap", () => {
    const { html } = protectForTranslate("See John 1:1 and λόγος.", ["Augustine"]);
    const plain = unwrapProtected(html);
    assert.match(plain, /John 1:1/);
    assert.match(plain, /λόγος/);
    assert.doesNotMatch(plain, /<span/);
  });
});

describe("isPrimarilyScripture", () => {
  it("detects quote equal to verse", () => {
    const v = "In the beginning was the Word, and the Word was with God.";
    assert.equal(isPrimarilyScripture(v, v), true);
    assert.equal(isPrimarilyScripture(`“${v}”`, v), true);
    assert.equal(
      isPrimarilyScripture("Calvin expounds election at length here.", v),
      false,
    );
  });
});
