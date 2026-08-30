/* Theos Logos — keep the installable WebAPK; do not cache scripture. */
const CACHE = "theos-logos-icons-v1";
const PRECACHE = [
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-512-maskable.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/__grok/manifest")) return;
  if (url.pathname.startsWith("/api/")) return;

  if (PRECACHE.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request)),
    );
  }
});
