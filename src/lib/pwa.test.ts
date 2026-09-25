import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveSafeTop } from "./pwa.ts";

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
});
