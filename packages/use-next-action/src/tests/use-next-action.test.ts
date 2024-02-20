import { describe, expect, test } from '@jest/globals'
import { withNextAction } from '../use-next-action'

/**
 * You cannot call headers() (from 'next/headers') outside of the
 * context of a next js app without getting an error. So here
 * we test withNextAction instead of the hook.
 */
describe('withNextAction hook', () => {
  test('returns result of next/func function', async () => {
    const result = await withNextAction(
      async props => {
        return {
          out: props.request.body
        }
      },
      { id: 1 },
      () => ({})
    )
    expect(result).toEqual({ out: { id: 1 } })
  })
})
