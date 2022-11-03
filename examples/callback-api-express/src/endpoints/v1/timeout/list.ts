import type { Props } from '@exobase/core'
import { useServices } from '@exobase/hooks'
import { useExpress } from '@exobase/use-express'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../database'
import * as t from '../../../types'
import * as mappers from '../../../view/mappers'

type Args = {}
type Services = {
  db: Database
}
type Response = {
  timeouts: t.TimeoutView[]
}

const listTimeouts = async ({
  services
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  const timeouts = await db.timeouts.list()
  return {
    timeouts: timeouts.map(mappers.TimeoutView.from)
  }
}

const endpoint: t.Endpoint = {
  handler: compose(
    useExpress(),
    useServices<Services>({
      db: makeDatabase
    }),
    listTimeouts
  ),
  config: {
    method: 'GET',
    path: '/v1/timeout'
  }
}

export default endpoint
