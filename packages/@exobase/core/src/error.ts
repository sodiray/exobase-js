import type { JsonError } from './types'

export const error = <
  TProperties extends { status?: number },
  TError = TProperties & JsonError
>(
  properties: TProperties
): TError =>
  ({
    format: '@json',
    ...properties,
    status: properties.status ?? 500
  } as TError)
