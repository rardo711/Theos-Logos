import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { t, corpusLabel, traditionLabel } from "./i18n.ts";

describe("i18n", () => {
  it("switches chrome to Spanish", () => {
    assert.equal(t("en", "inquire"), "Inquire");
    assert.equal(t("es", "inquire"), "Consultar");
    assert.equal(t("es", "chapter", { n: 1 }), "Capítulo 1");
    assert.equal(corpusLabel("es", "gospels", "name"), "Los Evangelios");
    assert.equal(traditionLabel("es", "patristic"), "Patrística");
  });
});
