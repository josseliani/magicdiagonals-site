const CACHE='md-risk-calc-v4';
const CORE=['./','./index.html','./style.css','./app.js','./icon.svg','./icon-blue.svg','./icon-apple.png','./icon-192.png','./icon-512.png','./icon-blue-192.png','./icon-blue-512.png','./manifest-en.webmanifest','./manifest-ru.webmanifest','./manifest-de.webmanifest','./manifest-es.webmanifest','./manifest-ja.webmanifest','./manifest-zh.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('md-risk-calc-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(c=>c.put(event.request,copy)));}return response;
 }).catch(async()=>{const found=await caches.match(event.request);if(found)return found;if(event.request.mode==='navigate')return caches.match('./index.html');return Response.error();}));
});
