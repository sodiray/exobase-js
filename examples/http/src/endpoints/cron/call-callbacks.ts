import type { Props } from '@exobase/core'
import { useApiKey, useServices } from '@exobase/hooks'
import { boil, compose, parallel, tryit } from 'radash'
import superagent from 'superagent'
import config from '../../config'
import makeDatabase, { Database } from '../../database'
import * as t from '../../types'

type Args = {
  id: t.Id<'timeout'>
}
type Services = {
  db: Database
}
type Response = void

/**
 * Get the latest callback for a timeout
 */
const latest = (timeout: t.Timeout): t.Callback | null => {
  return boil(timeout.callbacks, (a, b) => (a.index > b.index ? a : b))
}

export const callCallbacks = async ({
  services
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  const now = Date.now()
  console.log('[call-callbacks]', 'processing...')
  const timeouts = await db.timeouts.list()
  console.log('[call-callbacks]', `found ${timeouts.length} timeouts`)
  const timeoutsReadyForCallback = timeouts.filter(timeout => {
    const callback = latest(timeout)
    if (!callback) {
      return now - timeout.createdAt >= timeout.duration
    }
    return now - callback.timestamp >= timeout.duration
  })
  console.log(
    '[call-callbacks]',
    `${timeoutsReadyForCallback.length} are ready for callback`
  )
  await parallel(3, timeoutsReadyForCallback, async timeout => {
    const [err] = await tryit(superagent.post)(timeout.url)
    console.log(
      '[call-callbacks]',
      `callback for ${timeout.id}`,
      err ? err : 'success'
    )
    await db.timeouts.addCallback(timeout.id, {
      timestamp: now,
      success: err ? false : true,
      index: (latest(timeout)?.index ?? 0) + 1
    })
  })
}

export default compose(
  useApiKey(config.auth.apiKey),
  useServices<Services>({
    db: makeDatabase
  }),
  callCallbacks
)
