import * as t from './types'

export type Json = string | number | boolean | { [key: string]: Json | Json[] }

export const error = (
  attributes: { status?: number } & Json
): t.AbstractError => {
  return {
    type: '@error:json',
    status: attributes['status'] ?? 500,
    ...(attributes as object)
  }
}
