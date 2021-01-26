`use strict`;

/**
 * Ten plik obejmuje logikę service workera.
 * @type {string} cacheName Nazwa obiektu cache.
 * @type {string} filesToCache Tablica zawierająca obiekty do scacheowania.
 */
const cacheName = `Projekt końcowy PWA`;
const filesToCache = [
    `./`,
    `index.html`
];

/**
 * Używany do zapisywania zdefiniowanych obiektów cache, tj. obiektów, które
 * później używane mają być w trybie pracy aplikacji offline.
 */
self.addEventListener(`install`, (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

/**
 * Pobiera wszystkie dostępne obiekty cache.
 * Zwracane są obiekty nowe, już z usuniętymi odpowiednimi starymi obiektami cache.
 */
self.addEventListener(`activate`, (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheName.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

/**
 * Obsługuje przypadek, gdy aplikacja nie może pracować w trybie online.
 */
self.addEventListener(`fetch`, (e) => {
    e.respondWith(
        caches.match(e.request).then((r) => {
            console.log(`[Service Worker] Fetching resource: ` + e.request.url);
            return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
