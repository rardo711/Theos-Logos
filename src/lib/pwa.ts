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
 * Top padding that does not double-count iOS 27's letterboxed status bar.
 * Standalone only. A Safari tab keeps the reported inset.
 */
export function resolveSafeTop(input: {
  insetTop: number;
  screenHeight: number;
  innerHeight: number;
  standalone: boolean;
  iosMajor: number | null;
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
  return inset;
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
  });
  const fullscreen = window.matchMedia("(display-mode: fullscreen)").matches;
  const root = document.documentElement;
  root.style.setProperty("--safe-top", `${Math.round(resolved)}px`);
  root.style.setProperty(
    "--safe-top-min",
    fullscreen && inset < 12 && resolved < 12 ? "2rem" : "0px",
  );
}

/**
 * Measure the real bottom system-gesture overlay at runtime.
 * Android Chrome reports env(safe-area-inset-bottom) as 0px, so fixed rem
 * floors are guesses. The layout viewport (innerHeight) spans edge-to-edge
 * under the gesture bar; the visual viewport is what's actually visible.
 * Their difference is the obscured height. Never drops below the CSS floor,
 * and ignores huge shrinks (that's the keyboard, not the nav bar).
 */
export function lockSafeBottom() {
  if (typeof window === "undefined" || !document.body) return;
  const root = document.documentElement;
  const apply = () => {
    const vv = window.visualViewport;
    const overlay = vv
      ? Math.max(0, Math.round(window.innerHeight - vv.height))
      : 0;
    if (overlay > 200) return; // keyboard open, not the nav bar
    const cssFloor = 80; // 5rem fallback from --read-bottom
    const px = Math.max(cssFloor, overlay + 16);
    root.style.setProperty("--read-bottom", `${px}px`);
  };
  apply();
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", apply);
  } else {
    window.addEventListener("resize", apply);
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
