import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
  ONBOARDING_VERSION,
  completeOnboarding,
  isOnboardingComplete,
  resetOnboardingMemory,
} from "./onboarding.ts";

const store = new Map<string, string>();

function installMemoryStorage() {
  const storage = {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    key() {
      return null;
    },
    get length() {
      return store.size;
    },
  };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storage,
  });
}

describe("onboarding persistence", () => {
  beforeEach(() => {
    store.clear();
    resetOnboardingMemory();
    installMemoryStorage();
  });

  afterEach(() => {
    resetOnboardingMemory();
    store.clear();
  });

  it("persists as version 2", () => {
    assert.equal(ONBOARDING_VERSION, "2");
  });

  it("treats version 1 as incomplete after bump", () => {
    globalThis.localStorage.setItem("theos-logos.onboarding.version", "1");
    assert.equal(isOnboardingComplete(), false);
  });

  it("is incomplete with fresh storage", () => {
    assert.equal(isOnboardingComplete(), false);
  });

  it("completes with version + completedAt", () => {
    completeOnboarding();
    assert.equal(isOnboardingComplete(), true);
    assert.equal(
      globalThis.localStorage.getItem("theos-logos.onboarding.version"),
      ONBOARDING_VERSION,
    );
    const at = globalThis.localStorage.getItem(
      "theos-logos.onboarding.completedAt",
    );
    assert.ok(at && !Number.isNaN(Date.parse(at)));
  });

  it("survives memory reset when storage still holds version", () => {
    completeOnboarding();
    resetOnboardingMemory();
    assert.equal(isOnboardingComplete(), true);
  });

  it("returns after storage clear", () => {
    completeOnboarding();
    store.clear();
    resetOnboardingMemory();
    assert.equal(isOnboardingComplete(), false);
  });

  it("fail-open: blocked storage still completes for the session", () => {
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("blocked");
      },
    });
    assert.equal(isOnboardingComplete(), false);
    completeOnboarding();
    assert.equal(isOnboardingComplete(), true);
  });
});
