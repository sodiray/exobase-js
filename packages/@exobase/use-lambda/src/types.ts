import type { AbstractRequest } from '@exobase/core'
import { Context } from 'aws-lambda'

export type LambdaRequest<TEvent = any> = AbstractRequest & {
  event: TEvent
  context: Context
}
