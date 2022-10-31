import { Context } from 'aws-lambda'
import type { AbstractRequest } from '@exobase/core'

export type LambdaRequest<TEvent = any> = AbstractRequest & {
  event: TEvent
  context: Context
}
