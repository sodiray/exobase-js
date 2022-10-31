import { compose } from 'radash'
import type { Props } from 'exobase'
import { useNext } from 'exobase-use-next'
import { useRoute } from 'exobase-use-route'
import { useServices } from 'exobase-use-services'
import { useJsonArgs } from 'exobase-use-validation'
import makeDatabase, { Database } from '../../../../backend/database'
import model from '../../../../backend/model'
import * as t from '../../../../backend/types'
import * as mappers from '../../../../backend/view/mappers'

type GetArgs = {}
type GetServices = {
  db: Database
}
type GetResponse = {
  timeouts: t.TimeoutView[]
}

const listTimeouts = async ({
  services
}: Props<GetArgs, GetServices>): Promise<GetResponse> => {
  const { db } = services
  const timeouts = await db.timeouts.list()
  return {
    timeouts: timeouts.map(mappers.TimeoutView.from)
  }
}

export const listTimeoutsEndpoint = compose(
  useServices<GetServices>({
    db: makeDatabase
  }),
  listTimeouts
)

type CreateArgs = {
  url: string
  timeout: number
}
type CreateServices = {
  db: Database
}
type CreateResponse = {
  timeout: t.TimeoutView
}

export const createTimeout = async ({
  args,
  services
}: Props<CreateArgs, CreateServices>): Promise<CreateResponse> => {
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

export const createTimeoutEndpoint = compose(
  useJsonArgs<CreateArgs>(yup => ({
    url: yup.string().url().required(),
    timeout: yup.number().integer().positive().required()
  })),
  useServices<GetServices>({
    db: makeDatabase
  }),
  createTimeout
)

export default compose(
  useNext(),
  useRoute('GET', '*', listTimeoutsEndpoint),
  useRoute('POST', '*', createTimeoutEndpoint),
  async ({ response }: Props): Promise<Props['response']> => ({
    ...response,
    status: 404
  })
)
