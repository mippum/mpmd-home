self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
self.addEventListener('fetch', (e) => {
  // 네이버로 바로 리다이렉트 요청은 네트워크 우선
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
