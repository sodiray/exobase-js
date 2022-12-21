import { describe, expect, test } from '@jest/globals'
import { useCatch } from '../index'

describe('useCatch hook', () => {
  test('returns result of callback when error is thrown', async () => {
    const sut = useCatch((p, e) => {
      return 'ok'
    })
    const result = await sut(async () => {
      throw new Error('failed')
    })({} as any)
    expect(result).toBe('ok')
  })
  test('passes props and error to callback', async () => {
    const sut = useCatch((props, error) => {
      return { props, error }
    })
    const result = await sut(async () => {
      throw { id: 'error' }
    })({ id: 'props' } as any)
    expect(result).toStrictEqual({
      props: { id: 'props' },
      error: { id: 'error' }
    })
  })
  test('returns result when no error is thrown', async () => {
    const sut = useCatch((p, e) => {
      return 'ok'
    })
    const result = await sut(async () => {
      return 'hello'
    })({} as any)
    expect(result).toBe('hello')
  })
})
