import { Store, keys, get, del } from 'idb-keyval'
import LogRocket from 'logrocket'

const userId = '123'
LogRocket.identify(userId)

export const RequestStore = new Store(`logrocket-offline-${userId}`, `requests`)

let isSendingBacklog = true

LogRocket.init(process.env.LOGROCKET_ID, {
  shouldSendData: () => {
    return !isSendingBacklog
  },
})

// send backlog of requests on app load
sendRequests()
  .then(() => (isSendingBacklog = false))
  .catch((e) => {
    console.error(e)
    isSendingBacklog = false
  })

export async function sendRequests() {
  const requestKeys = await keys(RequestStore)

  // send each request one by one. i'm not sure if it's safe to batch them.
  for (const key of requestKeys) {
    const data = await get(key, RequestStore)

    if (data) {
      const { blob, ...request } = data
      await fetch(
        new Request(request.url, {
          ...request,
          // turning into arrayBuffer may be unnecessary - this just what i had when i got it working
          body: await blob.arrayBuffer(),
        })
      )

      del(key, RequestStore)
    }
  }
}
