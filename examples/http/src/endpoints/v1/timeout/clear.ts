import type { Props } from '@exobase/core'
import { usePathParams, useServices } from '@exobase/hooks'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../database'
import * as t from '../../../types'
import * as mappers from '../../../view/mappers'

type Args = {
  id: t.Id<'timeout'>
}
type Services = {
  db: Database
}
type Response = {
  timeout: t.TimeoutView
}

export const clearTimeoutEndpoint = async ({
  services,
  args
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  const timeout = await db.timeouts.patch(args.id, {
    status: 'cleared'
  })
  return {
    timeout: mappers.TimeoutView.from(timeout)
  }
}

export default compose(
  usePathParams('/v1/timeout/{id}/clear'),
  useServices<Services>({
    db: makeDatabase
  }),
  clearTimeoutEndpoint
)
