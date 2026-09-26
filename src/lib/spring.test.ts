import assert from "node:assert/strict";
import test from "node:test";
import { DESK_SPRING, coastTarget, springStep } from "./spring.ts";

test("desk spring reaches the target and settles once", () => {
  let x = 0;
  let v = 900;
  let peak = 0;
  let swings = 0;
  let side = 0;
  for (let i = 0; i < 2000; i++) {
    const next = springStep(x, v, 100, 1 / 120, DESK_SPRING);
    x = next.x;
    v = next.v;
    if (x > peak) peak = x;
    const nextSide = x > 101 ? 1 : x < 99 ? -1 : 0;
    if (nextSide !== 0 && nextSide !== side) {
      if (side !== 0) swings += 1;
      side = nextSide;
    }
  }
  assert.ok(Math.abs(x - 100) < 0.5, `rested at ${x}`);
  assert.ok(Math.abs(v) < 5, `still moving at ${v}`);
  assert.ok(peak > 99 && peak < 108, `overshot to ${peak}`);
  assert.ok(swings <= 1, `swung ${swings} times`);
});

const stops = { full: 0, mid: 220, peek: 500, hidden: 720 };

test("a held sheet stays, a swipe carries, a hard swipe shuts", () => {
  assert.equal(coastTarget(220, 0, stops), "mid");
  assert.equal(coastTarget(220, -900, stops), "full");
  assert.equal(coastTarget(220, 1100, stops), "peek");
  assert.equal(coastTarget(500, -1000, stops), "mid");
  assert.equal(coastTarget(500, -2400, stops), "full");
  assert.equal(coastTarget(500, 1600, stops), "hidden");
  assert.equal(coastTarget(0, 900, stops), "mid");
});
