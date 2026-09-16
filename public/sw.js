importScripts("portal/uv.bundle.js"),importScripts("portal/uv.config.js"),importScripts("portal/uv.sw.js");
const uv=new UVServiceWorker;
const DOOM_CACHE="doom-assets-v1";
const DOOM_ASSETS=["/games/doom/index.html","/games/doom/js-dos.js","/games/doom/js-dos.css","/games/doom/js-dos.wasm","/games/doom/wdosbox.js","/games/doom/wlibzip.js","/games/doom/wlibzip.wasm","/games/doom/emulators.js","/games/doom/freedoom1.wad","/games/doom/freedoom.jsdos"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(DOOM_CACHE).then(cache=>cache.addAll(DOOM_ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",event=>{event.waitUntil(self.clients.claim())});
async function handleRequest(t){
  const url=new URL(t.request.url);
  if(url.pathname.startsWith("/games/doom/")){const cache=await caches.open(DOOM_CACHE);const cached=await cache.match(t.request);if(cached)return cached;const response=await fetch(t.request);if(response.ok)cache.put(t.request,response.clone());return response}
  return uv.route(t)?await uv.fetch(t):await fetch(t.request)
}
self.addEventListener("fetch",(t=>{t.respondWith(handleRequest(t))}));
