import { compose } from 'radash'
import type { Props } from 'exobase'
import { useNext } from 'exobase-use-next'
import { usePathParams } from 'exobase-use-path-params'
import { useServices } from 'exobase-use-services'
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
