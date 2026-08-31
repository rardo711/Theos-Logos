import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generationConfigFor, isGemini3 } from "./gemini.ts";

describe("gemini request shape", () => {
  it("treats 3.6 as Gemini 3", () => {
    assert.equal(isGemini3("gemini-3.6-flash"), true);
    assert.equal(isGemini3("gemini-2.5-flash"), false);
  });

  it("omits temperature and thinkingBudget on 3.6, uses low thinking", () => {
    const cfg = generationConfigFor("gemini-3.6-flash", { temperature: 0.2 });
    assert.equal("temperature" in cfg, false);
    assert.deepEqual(cfg.thinkingConfig, { thinkingLevel: "low" });
    assert.equal(cfg.responseMimeType, "application/json");
  });

  it("keeps thinkingBudget 0 on 2.5 Flash", () => {
    const cfg = generationConfigFor("gemini-2.5-flash", {});
    assert.equal(cfg.temperature, 0.2);
    assert.deepEqual(cfg.thinkingConfig, { thinkingBudget: 0 });
  });
});
