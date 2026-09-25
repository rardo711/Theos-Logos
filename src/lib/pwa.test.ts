import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { phoneTier, resolveSafeBottom, resolveSafeTop } from "./pwa.ts";

describe("resolveSafeTop", () => {
  it("does not pad again when iOS 27 already letterboxed the status bar", () => {
    assert.equal(
      resolveSafeTop({
        insetTop: 62,
        screenHeight: 956,
        innerHeight: 894,
        standalone: true,
        iosMajor: 27,
      }),
      0,
    );
  });

  it("leaves a system-owned bar at 0 when the viewport is already shorter", () => {
    assert.equal(
      resolveSafeTop({
        insetTop: 0,
        screenHeight: 852,
        innerHeight: 793,
        standalone: true,
        iosMajor: 27,
      }),
      0,
    );
  });

  it("clears the clock when a full-bleed iOS 27 icon reports no top inset", () => {
    assert.equal(
      resolveSafeTop({
        insetTop: 0,
        screenHeight: 874,
        innerHeight: 874,
        standalone: true,
        iosMajor: 27,
      }),
      59,
    );
  });

  it("keeps a real edge-to-edge inset on an older Home Screen icon", () => {
    assert.equal(
      resolveSafeTop({
        insetTop: 59,
        screenHeight: 852,
        innerHeight: 818,
        standalone: true,
        iosMajor: 26,
      }),
      59,
    );
  });

  it("does not rewrite Safari-tab insets", () => {
    assert.equal(
      resolveSafeTop({
        insetTop: 59,
        screenHeight: 852,
        innerHeight: 700,
        standalone: false,
        iosMajor: 27,
      }),
      59,
    );
  });

  it("does not invent an iPhone inset for other phones", () => {
    assert.equal(
      resolveSafeTop({
        insetTop: 0,
        screenHeight: 800,
        innerHeight: 800,
        standalone: true,
        iosMajor: null,
      }),
      0,
    );
  });

  it("clears an Android status bar when the installed app is full-bleed and reports 0", () => {
    assert.equal(
      resolveSafeTop({
        insetTop: 0,
        screenHeight: 800,
        innerHeight: 800,
        standalone: true,
        iosMajor: null,
        android: true,
      }),
      32,
    );
  });

  it("trusts a real Android inset", () => {
    assert.equal(
      resolveSafeTop({
        insetTop: 24,
        screenHeight: 800,
        innerHeight: 800,
        standalone: true,
        iosMajor: null,
        android: true,
      }),
      24,
    );
  });

  it("does not pad the top of an Android browser tab", () => {
    assert.equal(
      resolveSafeTop({
        insetTop: 0,
        screenHeight: 800,
        innerHeight: 700,
        standalone: false,
        iosMajor: null,
        android: true,
      }),
      0,
    );
  });
});

describe("resolveSafeBottom", () => {
  it("uses a short floor when a touch phone reports no bottom inset", () => {
    assert.deepEqual(
      resolveSafeBottom({
        insetBottom: 0,
        innerHeight: 800,
        visualHeight: 800,
        touch: true,
      }),
      { bottom: 32, keyboard: 0 },
    );
  });

  it("keeps a measured nav bar instead of an 80px gap", () => {
    assert.deepEqual(
      resolveSafeBottom({
        insetBottom: 48,
        innerHeight: 800,
        visualHeight: 752,
        touch: true,
      }),
      { bottom: 48, keyboard: 0 },
    );
  });

  it("lifts for the keyboard instead of treating it as a nav bar", () => {
    assert.deepEqual(
      resolveSafeBottom({
        insetBottom: 0,
        innerHeight: 800,
        visualHeight: 420,
        touch: true,
      }),
      { bottom: 32, keyboard: 380 },
    );
  });

  it("does not force a phone floor on a desktop window", () => {
    assert.deepEqual(
      resolveSafeBottom({
        insetBottom: 0,
        innerHeight: 900,
        visualHeight: 900,
        touch: false,
      }),
      { bottom: 0, keyboard: 0 },
    );
  });
});

describe("phoneTier", () => {
  it("follows the window, not a model name", () => {
    assert.equal(phoneTier(320), "compact");
    assert.equal(phoneTier(390), "phone");
    assert.equal(phoneTier(412), "phone");
    assert.equal(phoneTier(700), "large");
    assert.equal(phoneTier(1280), null);
  });
});
