import type { Props } from '@exobase/core'
import { useJsonArgs, useServices } from '@exobase/hooks'
import { useExpress } from '@exobase/use-express'
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
    status: 'active',
    callbacks: [],
    createdAt: Date.now()
  }
  await db.timeouts.create(timeout)
  return {
    timeout: mappers.TimeoutView.from(timeout)
  }
}

const endpoint: t.Endpoint = {
  handler: compose(
    useExpress(),
    useJsonArgs<Args>(yup => ({
      url: yup.string().url().required(),
      timeout: yup.number().integer().positive().required()
    })),
    useServices<Services>({
      db: makeDatabase
    }),
    createTimeout
  ),
  config: {
    method: 'POST',
    path: '/v1/timeout'
  }
}

export default endpoint
