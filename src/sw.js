import { set, del } from 'idb-keyval'
import { RequestStore } from './logrocket'

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith('https://r.lr-ingest.io')) {
    const {
      bodyUsed,
      cache,
      credentials,
      destination,
      integrity,
      method,
      mode,
      redirect,
      referrer,
      referrerPolicy,
      url,
      headers,
      keepalive,
      blob,
    } = event.request

    event.respondWith(
      new Promise(async (resolve, reject) => {
        const request = {
          bodyUsed,
          cache,
          credentials,
          destination,
          integrity,
          method,
          mode,
          redirect,
          referrer,
          referrerPolicy,
          url,
          header: JSON.stringify(headers),
          keepalive,
          blob: await event.request.blob(),
        }
        const key = `${Date.now()}-${request.url}`
        set(key, request, RequestStore)

        fetch(
          new Request(request.url, {
            ...request,

            body: await request.blob.arrayBuffer(),
          })
        )
          .then((response) => {
            del(key, RequestStore)

            resolve(response)
          })
          .catch(reject)
      })
    )
  }
})

self.addEventListener('activate', function (event) {
  return self.clients.claim()
})
