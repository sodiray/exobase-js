import type { Props } from 'exobase'
import { useLambda } from 'exobase-use-lambda'
import { useServices } from 'exobase-use-services'
import { useJsonArgs } from 'exobase-use-validation'
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

export default compose(
  useLambda(),
  useJsonArgs<Args>(yup => ({
    url: yup.string().url().required(),
    timeout: yup.number().integer().positive().required()
  })),
  useServices<Services>({
    db: makeDatabase
  }),
  createTimeout
)
