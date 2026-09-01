import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { localizeTitle, localizeVoice } from "./i18n-sources.ts";

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
