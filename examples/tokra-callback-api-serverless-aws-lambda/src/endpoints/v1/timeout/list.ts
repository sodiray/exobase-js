import { compose } from 'radash'
import type { Props } from 'exobase'
import { useLambda } from 'exobase-use-lambda'
import { useServices } from 'exobase-use-services'
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

export default compose(
  useLambda(),
  useServices<Services>({
    db: makeDatabase
  }),
  listTimeouts
)
