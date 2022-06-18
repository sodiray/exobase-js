import type { Request } from '@exobase/core'
import { Context } from 'aws-lambda'

export type LambdaRequest<TEvent=any> = Request & {
    event: TEvent
    context: Context
}