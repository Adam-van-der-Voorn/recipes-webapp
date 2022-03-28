const cacheName = 'shell cache';

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(
                [
                    '/',
                    '/manifest.json',
                    '/index.html',
                    '/static/js/bundle.js',
                    '/favicon.ico',
                    '/logo192.png',
                    '/logo512.ong'
                ]
            );
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found', event.request.url, 'in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);

                return fetch(event.request)

                // TODO 4 - Add fetched files to the cache

            }).catch(error => {
                console.error('Caching error', error)
                return new Response("offline, idk why")

                // TODO 6 - Respond with custom offline page
            })
    );
});