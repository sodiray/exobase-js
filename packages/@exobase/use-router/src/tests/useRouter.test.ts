import { describe, expect, jest, test } from '@jest/globals'
import { useRouter } from '../index'

describe('usePathParams hook', () => {
  const mocks = () => ({
    endpoint: jest.fn(() => ({ message: 'not found' })),
    stars: {
      list: jest.fn(() => 'stars.list'),
      add: jest.fn(() => 'stars.add'),
      delete: jest.fn(() => 'stars.delete')
    },
    repos: {
      list: jest.fn(() => 'repos.list'),
      create: jest.fn(() => 'repos.create'),
      delete: jest.fn(() => 'repos.delete')
    },
    config: {
      any: jest.fn(() => 'config.any')
    }
  })
  test('fallsthrough to endpoint when no registered paths match', async () => {
    const mock = mocks()
    const sut = useRouter(router =>
      router
        .get('/repos/*/*/stars', mock.stars.list as any)
        .post('/repos/*/*/stars', mock.stars.add as any)
        .delete('/repos/*/*/stars', mock.stars.delete as any)
        .post('/repos/*', mock.repos.create as any)
        .delete('/repos/*/*', mock.repos.delete as any)
        .on('*', '/repos/config', mock.config.any as any)
    )
    const result = await sut(mock.endpoint as any)({
      request: {
        method: 'GET',
        path: '/repos/rayepps/exobase-js/stars/unknown/path/1'
      }
    } as any)
    expect(mock.endpoint).toBeCalledTimes(1)
    expect(result).toEqual({ message: 'not found' })
  })
  test('calls registered handler when path matches', async () => {
    const mock = mocks()
    const sut = useRouter(router =>
      router
        .get('/repos/*/*/stars', mock.stars.list as any)
        .post('/repos/*/*/stars', mock.stars.add as any)
        .delete('/repos/*/*/stars', mock.stars.delete as any)
        .post('/repos/*', mock.repos.create as any)
        .delete('/repos/*/*', mock.repos.delete as any)
        .on('*', '/repos/config', mock.config.any as any)
    )
    const result = await sut(mock.endpoint as any)({
      request: {
        method: 'GET',
        path: '/repos/rayepps/exobase-js/stars'
      }
    } as any)
    expect(mock.stars.list).toBeCalledTimes(1)
    expect(result).toBe('stars.list')
  })
})
