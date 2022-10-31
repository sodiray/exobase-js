import { compose } from 'radash'
import type { Props } from 'exobase'
import { error } from 'exobase'
import { useExpress } from 'exobase-use-express'
import { usePathParams } from 'exobase-use-path-params'
import { useServices } from 'exobase-use-services'
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

export const getTimeoutById = async ({
  services,
  args
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  const timeout = await db.timeouts.find(args.id)
  if (!timeout) {
    throw error({
      cause: 'NOT_FOUND',
      status: 404,
      message: 'Timeout not found',
      note: `Timeout with the id ${args.id} was not found in the database`,
      key: 'cb.err.timeout.find.unfound'
    })
  }
  return {
    timeout: mappers.TimeoutView.from(timeout)
  }
}

const endpoint: t.Endpoint = {
  handler: compose(
    useExpress(),
    usePathParams('/v1/timeout/{id}'),
    useServices<Services>({
      db: makeDatabase
    }),
    getTimeoutById
  ),
  config: {
    method: 'GET',
    path: '/v1/timeout/:id'
  }
}

export default endpoint
