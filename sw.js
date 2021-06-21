var CACHE_NAME = 'swtest'
var urlsToCache = [
  'index.json'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('activate', event => {
  console.log('sw activated')
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Got a hit for', event.request)
          return response
        } else {
          console.log('No cache for', event.request)
          return fetch(event.request)
            .then(resp => {
              if (! resp || resp.status !== 200 || resp.type != 'basic') {
                return resp
              } else {
                console.log('caching', event.request)
                var respToCache  = resp.clone()
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(event.request, respToCache)
                })
                return response; 
              }
            })
        }
      })
  )
})
