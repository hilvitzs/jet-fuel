self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v1').then(cache => {
      return cache.addAll([
        '/',
        '/assets/styles/main.css',
        '/assets/styles/normalize.css',
        '/jquery-3.2.1.min.js',
        '/assets/images/background.jpg',
        '/assets/images/logo.gif',
        '/assets/images/folder.png',
        '/index.js'
      ])
    })
  );
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
})
