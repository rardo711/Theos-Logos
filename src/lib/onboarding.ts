/**
 * First-run onboarding persistence (Look brief ES v3 / structure v2).
 * Locale lives in theos-logos-hybrid via study-store — do not duplicate.
 * Version bump re-shows intro once for prior completers.
 */

export const ONBOARDING_VERSION = "3";

const VERSION_KEY = "theos-logos.onboarding.version";
const COMPLETED_AT_KEY = "theos-logos.onboarding.completedAt";

/** Session fail-open when localStorage is blocked (private mode). */
let memoryComplete = false;

function storage(): Storage | null {
  try {
    if (typeof globalThis.localStorage === "undefined") return null;
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

export function isOnboardingComplete(): boolean {
  if (memoryComplete) return true;
  const s = storage();
  if (!s) return false;
  try {
    return s.getItem(VERSION_KEY) === ONBOARDING_VERSION;
  } catch {
    return false;
  }
}

export function completeOnboarding(): void {
  const at = new Date().toISOString();
  memoryComplete = true;
  const s = storage();
  if (!s) return;
  try {
    s.setItem(VERSION_KEY, ONBOARDING_VERSION);
    s.setItem(COMPLETED_AT_KEY, at);
  } catch {
    /* private mode — session flag already set */
  }
}

/** Test helper */
export function resetOnboardingMemory(): void {
  memoryComplete = false;
}
