import type { Props } from 'exobase'
import { useExpress } from 'exobase-use-express'
import { useServices } from 'exobase-use-services'
import { useJsonArgs } from 'exobase-use-validation'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../database'
import model from '../../../model'
import * as t from '../../../types'
import * as mappers from '../../../view/mappers'

type Args = {
  url: string
  interval: number
}
type Services = {
  db: Database
}
type Response = {
  interval: t.IntervalView
}

export const createInterval = async ({
  args,
  services
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  const interval: t.Interval = {
    id: model.id('interval'),
    duration: args.interval,
    status: 'active',
    callbacks: [],
    createdAt: Date.now()
  }
  await db.intervals.create(interval)
  return {
    interval: mappers.IntervalView.from(interval)
  }
}

const endpoint: t.Endpoint = {
  handler: compose(
    useExpress(),
    useJsonArgs<Args>(yup => ({
      url: yup.string().url().required(),
      interval: yup.number().integer().positive().required()
    })),
    useServices<Services>({
      db: makeDatabase
    }),
    createInterval
  ),
  config: {
    method: 'POST',
    path: '/v1/interval'
  }
}

export default endpoint
