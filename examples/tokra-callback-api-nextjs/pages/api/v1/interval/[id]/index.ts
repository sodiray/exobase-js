import type { Props } from 'exobase'
import { error } from 'exobase'
import { useNext } from 'exobase-use-next'
import { usePathParams } from 'exobase-use-path-params'
import { useServices } from 'exobase-use-services'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../../../backend/database'
import * as t from '../../../../../backend/types'
import * as mappers from '../../../../../backend/view/mappers'

type Args = {
  id: t.Id<'interval'>
}
type Services = {
  db: Database
}
type Response = {
  interval: t.IntervalView
}

export const getIntervalById = async ({
  services,
  args
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  const interval = await db.intervals.find(args.id)
  if (!interval) {
    throw error({
      cause: 'NOT_FOUND',
      status: 404,
      message: 'Interval not found',
      note: `Interval with the id ${args.id} was not found in the database`,
      key: 'cb.err.interval.find.unfound'
    })
  }
  return {
    interval: mappers.IntervalView.from(interval)
  }
}

export default compose(
  useNext(),
  usePathParams('/v1/interval/{id}'),
  useServices<Services>({
    db: makeDatabase
  }),
  getIntervalById
)
