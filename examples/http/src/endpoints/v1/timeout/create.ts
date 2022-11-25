import type { Props } from '@exobase/core'
import { useJsonBody, useServices } from '@exobase/hooks'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../database'
import model from '../../../model'
import * as t from '../../../types'
import * as mappers from '../../../view/mappers'

type Args = {
  url: string
  timeout: number
}
type Services = {
  db: Database
}
type Response = {
  timeout: t.TimeoutView
}

export const createTimeout = async ({
  args,
  services
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  const timeout: t.Timeout = {
    id: model.id('timeout'),
    duration: args.timeout,
    url: args.url,
    status: 'active',
    callbacks: [],
    createdAt: Date.now()
  }
  await db.timeouts.create(timeout)
  return {
    timeout: mappers.TimeoutView.from(timeout)
  }
}

export default compose(
  useJsonBody<Args>(z => ({
    url: z.string().url(),
    timeout: z.number()
  })),
  useServices<Services>({
    db: makeDatabase
  }),
  createTimeout
)
