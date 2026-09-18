self.addEventListener("install",(event)=>{
	event.waitUntil(
		caches.open("pwa-cache").then((cache)=>{
			return caches.addAll([
				"/MUO-V1/",
				"/index.html",
				"/style.css",
				"/script.js",
				"/css-setup.js",
                "/papaparse.min.js",
                "/jszip.min.js"
			])
		})
	)
});

self.addEventListener("fetch",(event)=>{
	event.respondWith(
		caches.match(event.request).then((response)=>{
			return response || fetch(event.request);
		})
	)
});