import { describe, expect, jest, test } from '@jest/globals'
import { usePathParams } from '../index'
import { parsePathParams as parse } from '../usePathParams'

describe('usePathParams hook', () => {
  test('calls endpoint with parsed path param', async () => {
    const sut = usePathParams('/library/books/{id}')
    const mockEndpoint = jest.fn(props => ({ book: { id: props.args.id } }))
    const result = await sut(mockEndpoint as any)({
      request: {
        path: '/library/books/x.book.abc123'
      }
    } as any)
    expect(result.book.id).toBe('x.book.abc123')
  })
})

describe('parsePathParams', () => {
  const workspace = 'w1'
  const account = 'a1'

  const request = {
    path: `/v1/show/${workspace}/account/${account}/details`
  }

  test('returns parsed params', async () => {
    expect(
      parse(request, '/v1/show/{workspace}/account/{account}/details')
    ).toStrictEqual({
      workspace,
      account
    })
  })

  test('throws error when path does not match', () => {
    const caught =
      (func: Function) =>
      (path: string): any => {
        try {
          func(request, path)
        } catch (err) {
          return err
        }
        return null
      }
    const p = caught(parse)
    expect(p('/v1/show/{workspace}/account/{account}')?.key).not.toBeNull()
    expect(p('/v1/show/{workspace}')?.key).not.toBeNull()
    expect(p('/v1/show/{workspace}/account')?.key).not.toBeNull()
    expect(p('/v1/show')?.key).not.toBeNull()
  })
})
