import type { Props } from 'exobase'
import { useExpress } from 'exobase-use-express'
import { usePathParams } from 'exobase-use-path-params'
import { useServices } from 'exobase-use-services'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../database'
import * as t from '../../../types'

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

const endpoint: t.Endpoint = {
  handler: compose(
    useExpress(),
    usePathParams('/v1/interval/{id}/clear'),
    useServices<Services>({
      db: makeDatabase
    }),
    clearIntervalEndpoint
  ),
  config: {
    method: 'PUT',
    path: '/v1/interval/:id/clear'
  }
}

export default endpoint
