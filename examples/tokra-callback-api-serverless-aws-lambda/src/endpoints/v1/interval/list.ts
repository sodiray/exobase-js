import type { Props } from 'exobase'
import { useLambda } from 'exobase-use-lambda'
import { useServices } from 'exobase-use-services'
import { compose } from 'radash'
import makeDatabase, { Database } from '../../../database'
import * as t from '../../../types'
import * as mappers from '../../../view/mappers'

type Args = {}
type Services = {
  db: Database
}
type Response = {
  intervals: t.IntervalView[]
}

const listIntervals = async ({
  services
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  const intervals = await db.intervals.list()
  return {
    intervals: intervals.map(mappers.IntervalView.from)
  }
}

export default compose(
  useLambda(),
  useServices<Services>({
    db: makeDatabase
  }),
  listIntervals
)
