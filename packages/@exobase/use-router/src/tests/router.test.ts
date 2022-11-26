import { describe, expect, jest, test } from '@jest/globals'
import { createRouter } from '../router'

describe('router', () => {
  const mocks = {
    stars: {
      listOrOptionsOrHead: jest.fn(() => 'stars.list|options|head'),
      add: jest.fn(() => 'stars.add'),
      delete: jest.fn(() => 'stars.delete')
    },
    repos: {
      list: jest.fn(() => 'repos.list'),
      create: jest.fn(() => 'repos.create'),
      delete: jest.fn(() => 'repos.delete'),
      settings: {
        patch: jest.fn(() => 'repos.settings.patch'),
        put: jest.fn(() => 'repos.settings.update')
      }
    },
    config: {
      any: jest.fn(() => 'config.any')
    }
  }
  const router = createRouter()
    .on(
      ['OPTIONS', 'HEAD', 'GET'],
      '/repos/*/*/stars',
      mocks.stars.listOrOptionsOrHead as any
    )
    .post('/repos/*/*/stars', mocks.stars.add as any)
    .delete('/repos/*/*/stars', mocks.stars.delete as any)
    .post('/repos/*', mocks.repos.create as any)
    .delete('/repos/*/*', mocks.repos.delete as any)
    .patch('/repos/*/*/settings', mocks.repos.settings.patch as any)
    .put('/repos/*/*/settings', mocks.repos.settings.put as any)
    .on('*', '/repos/config', mocks.config.any as any)
  test('returns correct handler given props', () => {
    expect(
      router.lookup({
        path: '/repos/rayepps/exobase-js/stars',
        method: 'GET'
      })
    ).toBe(mocks.stars.listOrOptionsOrHead)
    expect(
      router.lookup({
        path: '/repos/rayepps/exobase-js/stars',
        method: 'OPTIONS'
      })
    ).toBe(mocks.stars.listOrOptionsOrHead)
    expect(
      router.lookup({
        path: '/repos/rayepps/exobase-js/stars',
        method: 'HEAD'
      })
    ).toBe(mocks.stars.listOrOptionsOrHead)
    expect(
      router.lookup({
        path: '/repos/rayepps/exobase-js/stars',
        method: 'POST'
      })
    ).toBe(mocks.stars.add)
    expect(
      router.lookup({
        path: '/repos/rayepps/exobase-js/stars',
        method: 'DELETE'
      })
    ).toBe(mocks.stars.delete)
    expect(
      router.lookup({
        path: '/repos/rayepps',
        method: 'POST'
      })
    ).toBe(mocks.repos.create)
    expect(
      router.lookup({
        path: '/repos/rayepps/exobase-js',
        method: 'DELETE'
      })
    ).toBe(mocks.repos.delete)
    expect(
      router.lookup({
        path: '/repos/config',
        method: 'PATCH'
      })
    ).toBe(mocks.config.any)
    expect(
      router.lookup({
        path: '/repos/config',
        method: '*'
      })
    ).toBe(mocks.config.any)
    expect(
      router.lookup({
        path: '/unknown',
        method: 'PUT'
      })
    ).toBeNull()
    expect(
      router.lookup({
        path: '/repos/rayepps/exobase-js/unknown/path/1',
        method: '*'
      })
    ).toBeNull()
  })
})
