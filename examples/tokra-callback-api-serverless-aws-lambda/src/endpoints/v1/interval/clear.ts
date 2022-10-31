import type { Props } from 'exobase'
import { useLambda } from 'exobase-use-lambda'
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

export default compose(
  useLambda(),
  usePathParams('/v1/interval/{id}/clear'),
  useServices<Services>({
    db: makeDatabase
  }),
  clearIntervalEndpoint
)
