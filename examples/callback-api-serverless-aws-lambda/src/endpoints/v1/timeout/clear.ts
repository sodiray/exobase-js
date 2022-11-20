import type { Props } from '@exobase/core'
import { usePathParams, useServices } from '@exobase/hooks'
import { useLambda } from '@exobase/use-lambda'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../database'
import * as t from '../../../types'

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
  useLambda(),
  usePathParams('/v1/timeout/{id}/clear'),
  useServices<Services>({
    db: makeDatabase
  }),
  clearTimeoutEndpoint
)
