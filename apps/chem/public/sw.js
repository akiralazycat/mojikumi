const CACHE_PREFIX = "mojikumi-chem-";
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-icon.png"
];

async function precacheApp() {
  const cache = await caches.open(CACHE_NAME);
  const [pageResponse, manifestResponse] = await Promise.all([
    fetch("/", { cache: "no-store" }),
    fetch("/precache.json", { cache: "no-store" })
  ]);
  const html = await pageResponse.clone().text();
  const buildAssets = manifestResponse.ok ? await manifestResponse.json() : [];
  await cache.put("/", pageResponse);
  const assetPaths = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((path) => path && (path.startsWith("/_next/static/") || /\.(?:css|js|woff2?)$/.test(path)));
  await Promise.all([
    ...APP_SHELL.filter((path) => path !== "/").map((path) => cache.add(path)),
    ...[...new Set([...assetPaths, ...buildAssets])].map((path) => cache.add(path))
  ]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precacheApp());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function shouldCacheAsset(url) {
  return url.pathname.startsWith("/_next/static/") || /\.(?:css|js|woff2?|png|ico|webmanifest)$/.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && !url.search) caches.open(CACHE_NAME).then((cache) => cache.put("/", response.clone()));
          return response;
        })
        .catch(() => caches.match("/"))
    );
    return;
  }
  if (!shouldCacheAsset(url)) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
