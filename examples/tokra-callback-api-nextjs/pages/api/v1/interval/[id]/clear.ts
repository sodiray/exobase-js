import type { Props } from 'exobase'
import { useNext } from 'exobase-use-next'
import { usePathParams } from 'exobase-use-path-params'
import { useServices } from 'exobase-use-services'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../../../backend/database'
import * as t from '../../../../../backend/types'

type Args = {
  id: t.Id<'interval'>
}
type Services = {
  db: Database
}
type Response = void

export const clearIntervalEndpoint = async ({
  services,
  args
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  await db.intervals.patch(args.id, {
    status: 'cleared'
  })
}

export default compose(
  useNext(),
  usePathParams('/v1/interval/{id}/clear'),
  useServices<Services>({
    db: makeDatabase
  }),
  clearIntervalEndpoint
)
