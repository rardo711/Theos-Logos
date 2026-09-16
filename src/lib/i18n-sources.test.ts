import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  localizeBookNamesInBody,
  localizeCard,
  localizeTitle,
  localizeVoice,
} from "./i18n-sources.ts";

describe("source titles", () => {
  it("uses received Spanish titles, not a cheap model", () => {
    assert.equal(localizeVoice("Augustine", "es"), "Agustín");
    assert.equal(localizeVoice("John Calvin", "es"), "Juan Calvino");
    assert.equal(
      localizeTitle("Tractates on the Gospel of John 1", "es"),
      "Tratados sobre el Evangelio de Juan 1",
    );
    assert.equal(localizeTitle("Commentary on John 1:1", "es"), "Comentario a Juan 1:1");
    assert.equal(localizeTitle("Homilies on Romans 9", "es"), "Homilías sobre Romanos 9");
    assert.equal(localizeTitle("City of God, Book 11", "es"), "La ciudad de Dios, Libro 11");
    assert.equal(localizeTitle("Commentary on John 1:1", "en"), "Commentary on John 1:1");
  });
});

describe("book names in ES card bodies", () => {
  it("localizes English book names in quotes without touching Greek or URLs", () => {
    const raw =
      "Cf. John 1:4 and 1 John 1:1 on the Λόγος; see https://biblehub.com/john/1-4.htm";
    const out = localizeBookNamesInBody(raw, "es");
    assert.match(out, /Juan 1:4/);
    assert.match(out, /1 Juan 1:1/);
    assert.match(out, /Λόγος/);
    assert.match(out, /https:\/\/biblehub\.com\/john\/1-4\.htm/);
    assert.doesNotMatch(out, /\bJohn 1:4\b/);
    assert.equal(localizeBookNamesInBody(raw, "en"), raw);
  });

  it("localizeCard rewrites book names in quote for locale=es only", () => {
    const card = {
      voice: "Geneva Bible",
      work: "Notes on John",
      tradition: "reformed" as const,
      citation: "John 1:4",
      quote: "See John 1:4; compare Romans 8:28 and the Λόγος.",
      source: "generated" as const,
    };
    const es = localizeCard(card, "es");
    assert.match(es.quote, /Juan 1:4/);
    assert.match(es.quote, /Romanos 8:28/);
    assert.match(es.quote, /Λόγος/);
    assert.match(es.work, /Juan/);
    const en = localizeCard(card, "en");
    assert.equal(en.quote, card.quote);
  });
});
