import type { Props } from 'exobase'
import { useNext } from 'exobase-use-next'
import { useRoute } from 'exobase-use-route'
import { useServices } from 'exobase-use-services'
import { useJsonArgs } from 'exobase-use-validation'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../../backend/database'
import model from '../../../../backend/model'
import * as t from '../../../../backend/types'
import * as mappers from '../../../../backend/view/mappers'

type GetArgs = {}
type GetServices = {
  db: Database
}
type GetResponse = {
  intervals: t.IntervalView[]
}

const listIntervals = async ({
  services
}: Props<GetArgs, GetServices>): Promise<GetResponse> => {
  const { db } = services
  const intervals = await db.intervals.list()
  return {
    intervals: intervals.map(mappers.IntervalView.from)
  }
}

export const listIntervalsEndpoint = compose(
  useServices<GetServices>({
    db: makeDatabase
  }),
  listIntervals
)

type CreateArgs = {
  url: string
  interval: number
}
type CreateServices = {
  db: Database
}
type CreateResponse = {
  interval: t.IntervalView
}

export const createInterval = async ({
  args,
  services
}: Props<CreateArgs, CreateServices>): Promise<CreateResponse> => {
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

export const createIntervalEndpoint = compose(
  useJsonArgs<CreateArgs>(yup => ({
    url: yup.string().url().required(),
    interval: yup.number().integer().positive().required()
  })),
  useServices<GetServices>({
    db: makeDatabase
  }),
  createInterval
)

export default compose(
  useNext(),
  useRoute('GET', '*', listIntervalsEndpoint),
  useRoute('POST', '*', createIntervalEndpoint),
  async ({ response }: Props): Promise<Props['response']> => ({
    ...response,
    status: 404
  })
)
