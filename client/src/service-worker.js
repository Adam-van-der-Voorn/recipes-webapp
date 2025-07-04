// @ts-nocheck

const VERSION = "v16";
const CACHE_NAME = `vdv-recipes-${VERSION}`;
const LOG_TAG = `${VERSION}-sw:`
const STATIC_RESOURCES_TO_CACHE = [
    "/",
    "/static/js/main.bundle.js",
    "/static/style/auth.css",
    "/static/style/dropdown.css",
    "/static/style/general.css",
    "/static/style/header.css",
    "/static/style/recipe_card.css",
    "/static/style/recipe_form.css",
    "/static/style/recipe_view.css",
    "/static/style/values.css",
    "/static/style/reset.css",
    "/static/style/error.css",
    "/static/style/fonts.css",
    "/static/vector/circle.svg",
    "/static/typeface/karla/Karla.woff2",
    "/favicon.ico",
    "/index.html",
];

// called when a new version of the service worker is detected by the browser
self.addEventListener("install", onInstall);

// called when the new service worker version is ready
self.addEventListener("activate", onActivate);

// intercept server requests and resond with cached if required
self.addEventListener("fetch", ev => ev.respondWith(cacheThenNetwork(ev.request)));

function onInstall(event) {
    console.log(LOG_TAG, "installed")
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(STATIC_RESOURCES_TO_CACHE);
        })()
    );
}

function onActivate(event) {
    console.log(LOG_TAG, "activated")
    // delete old caches
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log("delete cache", name)
                        return caches.delete(name);
                    }
                })
            );
        })()
    );
}

async function cacheThenNetwork(request) {
    if (CONST_IS_DEV_BUILD === true) {
        console.log(LOG_TAG, "dev mode, bypassing cache for", request.url)
        return fetch(request);
    }

    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        console.log(LOG_TAG, "cache hit for", request.url)
        return cachedResponse;
    }
    
    console.log(LOG_TAG, "cache miss for", request.url)
    return fetch(request);
}