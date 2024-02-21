import { describe, expect, test } from '@jest/globals'
import { compose, Props } from '@exobase/core'
import { useMetadata } from '../index'

const useMockRootHook =
  () =>
  (func: (props: Props) => Promise<any>) => async () => {
    return await func({ id: 'mock-props' } as unknown as Props)
  }

describe('useMetadata hook', () => {
  test('attaches the given properties to the function chain', async () => {
    const func = compose(
      useMockRootHook(),
      useMetadata({
        route: '/api/v1/users',
        method: 'POST'
      }),
      async () => {
        return 'done'
      }
    )
    expect(func.route).toBe('/api/v1/users')
    expect(func.method).toBe('POST')
    expect(await func()).toBe('done')
  })
})
