import { Props } from '@exobase/core'
import { describe, expect, jest, test } from '@jest/globals'
import { usePathParser } from '../index'

describe('usePathParser hook', () => {
  test('calls endpoint with parsed path param', async () => {
    const sut = usePathParser('/library/books/{id}')
    const mockEndpoint = jest.fn((props: Props<{ id: string }>) => ({
      book: { id: props.request.params.id }
    }))
    const result = await sut(mockEndpoint as any)({
      request: {
        path: '/library/books/x.book.abc123'
      }
    } as any)
    expect(result.book.id).toBe('x.book.abc123')
  })
})
