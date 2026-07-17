'use strict';
const CACHE='arnav-weather-web-v2';
const ASSETS=['/','/index.html','/styles/variables.css','/styles/base.css','/styles/layout.css','/styles/navigation.css','/styles/components.css','/styles/pages.css','/styles/animations.css','/styles/theme-switch.css','/styles/responsive.css','/scripts/theme.js','/scripts/router.js','/scripts/weather.js','/scripts/api.js','/scripts/search.js','/scripts/favorites.js','/scripts/settings.js','/scripts/air-quality.js','/scripts/animations.js','/scripts/navigation.js','/scripts/main.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).pathname.startsWith('/api/'))return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,copy));return r}).catch(()=>caches.match('/index.html'))));});
