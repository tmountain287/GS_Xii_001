const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/Build/Build.loader.js',
    '/Build/Build.framework.js',
    '/Build/Build.data',
    '/Build/Build.wasm',
    '/TemplateData/style.css',
    '/TemplateData/favicon.ico'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request).then(function (response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
                cache.put(event.request, responseToCache);
            });
            return response;
        }).catch(function () {
            return caches.match(event.request);
        })
    );
});

self.addEventListener('activate', function (event) {
    var cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
