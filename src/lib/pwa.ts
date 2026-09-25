type InstallPrompt = {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: InstallPrompt | null = null;
const listeners = new Set<() => void>();
let statusBarObserver: MutationObserver | null = null;

/** Clock clearance when an iOS 27 icon still draws under the status bar but reports no inset. */
const IOS27_TOP_FALLBACK = 59;

function notify() {
  for (const fn of listeners) fn();
}

/** Keep Android's status bar on oxblood. Control Center re-reads the meta. */
const OXBLOOD = "#821111";

/**
 * Safari freezes the OS token (iPhone OS 18_x) from iOS 26 on.
 * `Version/` still tracks the OS major. Home Screen web apps are Safari.
 */
export function iosMajor(): number | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent || "";
  if (!/iP(hone|ad|od)/.test(ua)) return null;
  const match = ua.match(/Version\/(\d+)/);
  if (!match) return null;
  const major = Number(match[1]);
  return Number.isFinite(major) ? major : null;
}

/**
 * Top padding that does not double-count a letterboxed status bar.
 * Standalone only. A browser tab keeps the reported inset.
 * Android installed apps often report 0 while still drawing under the
 * status bar; a short fallback clears it without a fake iPhone inset.
 */
export function resolveSafeTop(input: {
  insetTop: number;
  screenHeight: number;
  innerHeight: number;
  standalone: boolean;
  iosMajor: number | null;
  android?: boolean;
}): number {
  const inset = Math.max(0, Math.round(input.insetTop));
  const missing = Math.max(0, Math.round(input.screenHeight - input.innerHeight));
  if (input.standalone && inset >= 20 && missing >= inset - 4) return 0;
  if (
    input.standalone &&
    (input.iosMajor ?? 0) >= 27 &&
    inset < 12 &&
    missing < 20
  ) {
    return IOS27_TOP_FALLBACK;
  }
  if (input.android && input.standalone && inset < 12 && missing < 24) return 32;
  return inset;
}

/** Bottom system bar, separate from the keyboard. Touch phones get a 32px floor when Chrome reports 0. */
export function resolveSafeBottom(input: {
  insetBottom: number;
  innerHeight: number;
  visualHeight: number;
  touch: boolean;
}): { bottom: number; keyboard: number } {
  const inset = Math.max(0, Math.round(input.insetBottom));
  const overlay = Math.max(0, Math.round(input.innerHeight - input.visualHeight));
  if (overlay > 200) {
    return { bottom: Math.max(inset, input.touch ? 32 : 0), keyboard: overlay };
  }
  const nav = Math.max(inset, overlay);
  if (!input.touch) return { bottom: nav, keyboard: 0 };
  return { bottom: Math.max(nav, 32), keyboard: 0 };
}

export type PhoneTier = "compact" | "phone" | "large";

/** Width tiers. Not a device catalog — the window is the phone. */
export function phoneTier(width: number): PhoneTier | null {
  if (width < 360) return "compact";
  if (width < 480) return "phone";
  if (width < 768) return "large";
  return null;
}

export function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Android/i.test(ua) && !/iP(hone|ad|od)/.test(ua);
}

export function lockPhoneClass() {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const tier = phoneTier(window.innerWidth);
  if (tier) root.dataset.phone = tier;
  else delete root.dataset.phone;
  if (isAndroid()) root.dataset.android = "true";
  else delete root.dataset.android;
}

export function lockThemeColor() {
  if (typeof document === "undefined") return;
  const apply = () => {
    document
      .querySelectorAll('meta[name="theme-color"][media]')
      .forEach((el) => el.remove());
    let meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    if (meta.getAttribute("content") !== OXBLOOD) {
      meta.setAttribute("content", OXBLOOD);
    }
  };
  apply();
  document.addEventListener("visibilitychange", apply);
}

/**
 * iOS 27 Home Screen apps blur anything drawn under the status bar, and
 * `black-translucent` is what asks for that. Drop the meta on iOS 27 so the
 * system owns the bar (oxblood, sampled from `.tl-ios27-status`).
 * Older iPhones keep the meta. Icons added before this change keep their
 * saved chrome until they are deleted and added again.
 */
export function releaseIos27StatusBar() {
  if (typeof document === "undefined") return;
  if ((iosMajor() ?? 0) < 27) return;
  document.documentElement.classList.add("tl-ios27");
  const strip = () => {
    document
      .querySelectorAll('meta[name="apple-mobile-web-app-status-bar-style"]')
      .forEach((el) => el.remove());
  };
  strip();
  if (statusBarObserver || typeof MutationObserver === "undefined") return;
  statusBarObserver = new MutationObserver(strip);
  statusBarObserver.observe(document.head, { childList: true, subtree: true });
}

export function initPwa() {
  if (typeof window === "undefined") return;
  lockThemeColor();
  releaseIos27StatusBar();
  lockPhoneClass();
  lockSafeBottom();
  if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
  }
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferred = event as unknown as InstallPrompt;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

export function canInstallPwa() {
  return deferred != null && !isStandalone();
}

export function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

function measureInset(side: "top" | "right" | "bottom" | "left") {
  const probe = document.createElement("div");
  const axis = side === "left" || side === "right" ? "width" : "height";
  probe.style.cssText = `position:fixed;visibility:hidden;pointer-events:none;${axis}:env(safe-area-inset-${side},0px)`;
  document.body.appendChild(probe);
  const rect = probe.getBoundingClientRect();
  probe.remove();
  return axis === "width" ? rect.width : rect.height;
}

/** When Android fullscreen reports 0 inset, keep the camera cutout off the chrome. */
export function lockSafeTop() {
  if (typeof window === "undefined" || !document.body) return;
  releaseIos27StatusBar();
  const inset = measureInset("top");
  const resolved = resolveSafeTop({
    insetTop: inset,
    screenHeight: window.screen?.height ?? 0,
    innerHeight: window.innerHeight,
    standalone: isStandalone(),
    iosMajor: iosMajor(),
    android: isAndroid(),
  });
  const fullscreen = window.matchMedia("(display-mode: fullscreen)").matches;
  const root = document.documentElement;
  root.style.setProperty("--safe-top", `${Math.round(resolved)}px`);
  root.style.setProperty("--safe-left", `${Math.round(measureInset("left"))}px`);
  root.style.setProperty("--safe-right", `${Math.round(measureInset("right"))}px`);
  root.style.setProperty(
    "--safe-top-min",
    fullscreen && inset < 12 && resolved < 12 ? "2rem" : "0px",
  );
}

let bottomBound = false;

function applySafeBottom() {
  if (typeof window === "undefined" || !document.body) return;
  const root = document.documentElement;
  const vv = window.visualViewport;
  const touch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
  const resolved = resolveSafeBottom({
    insetBottom: measureInset("bottom"),
    innerHeight: window.innerHeight,
    visualHeight: vv ? vv.height : window.innerHeight,
    touch,
  });
  root.style.setProperty("--safe-bottom", `${resolved.bottom}px`);
  root.style.setProperty("--keyboard", `${resolved.keyboard}px`);
}

/**
 * Android Chrome often reports env(safe-area-inset-bottom) as 0.
 * Use the obscured strip when it is a nav bar, and lift sheets when it is the keyboard.
 * Does not keep the old 5rem floor — that left an empty band under the chapter.
 */
export function lockSafeBottom() {
  if (typeof window === "undefined" || !document.body) return;
  applySafeBottom();
  if (bottomBound) return;
  bottomBound = true;
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", applySafeBottom);
  } else {
    window.addEventListener("resize", applySafeBottom);
  }
}

export function subscribePwa(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export async function installPwa() {
  if (!deferred) return false;
  const prompt = deferred;
  deferred = null;
  notify();
  await prompt.prompt();
  const { outcome } = await prompt.userChoice;
  return outcome === "accepted";
}
