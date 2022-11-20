import { Props } from '@exobase/core'
import { usePathParams, useServices } from '@exobase/hooks'
import { useNext } from '@exobase/use-next'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../../../backend/database'
import * as t from '../../../../../backend/types'

type Args = {
  id: t.Id<'timeout'>
}
type Services = {
  db: Database
}
type Response = void

export const clearTimeoutEndpoint = async ({
  services,
  args
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  await db.timeouts.patch(args.id, {
    status: 'cleared'
  })
}

export default compose(
  useNext(),
  usePathParams('/v1/timeout/{id}/clear'),
  useServices<Services>({
    db: makeDatabase
  }),
  clearTimeoutEndpoint
)
