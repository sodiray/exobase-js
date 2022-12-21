import { describe, expect, jest, test } from '@jest/globals'
import { router } from '../router'

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
  const sut = router()
    .on(
      ['OPTIONS', 'HEAD', 'GET'],
      '/repos/{owner}/{repo}/stars',
      mocks.stars.listOrOptionsOrHead as any
    )
    .post('/repos/{owner}/{repo}/stars', mocks.stars.add as any)
    .delete('/repos/{owner}/{repo}/stars', mocks.stars.delete as any)
    .post('/repos/{owner}', mocks.repos.create as any)
    .delete('/repos/{owner}/{repo}', mocks.repos.delete as any)
    .patch('/repos/{owner}/{repo}/settings', mocks.repos.settings.patch as any)
    .put('/repos/{owner}/{repo}/settings', mocks.repos.settings.put as any)
    .on('*', '/repos/config', mocks.config.any as any)
  test('returns correct handler given props', () => {
    expect(
      sut.lookup({
        path: '/repos/rayepps/exobase-js/stars',
        method: 'GET'
      }).handler
    ).toBe(mocks.stars.listOrOptionsOrHead)
    expect(
      sut.lookup({
        path: '/repos/rayepps/exobase-js/stars',
        method: 'OPTIONS'
      }).handler
    ).toBe(mocks.stars.listOrOptionsOrHead)
    expect(
      sut.lookup({
        path: '/repos/rayepps/exobase-js/stars',
        method: 'HEAD'
      }).handler
    ).toBe(mocks.stars.listOrOptionsOrHead)
    expect(
      sut.lookup({
        path: '/repos/rayepps/exobase-js/stars',
        method: 'POST'
      }).handler
    ).toBe(mocks.stars.add)
    expect(
      sut.lookup({
        path: '/repos/rayepps/exobase-js/stars',
        method: 'DELETE'
      }).handler
    ).toBe(mocks.stars.delete)
    expect(
      sut.lookup({
        path: '/repos/rayepps',
        method: 'POST'
      }).handler
    ).toBe(mocks.repos.create)
    expect(
      sut.lookup({
        path: '/repos/rayepps/exobase-js',
        method: 'DELETE'
      }).handler
    ).toBe(mocks.repos.delete)
    expect(
      sut.lookup({
        path: '/repos/config',
        method: 'PATCH'
      }).handler
    ).toBe(mocks.config.any)
    expect(
      sut.lookup({
        path: '/repos/config',
        method: '*'
      }).handler
    ).toBe(mocks.config.any)
    expect(
      sut.lookup({
        path: '/unknown',
        method: 'PUT'
      }).handler
    ).toBeNull()
    expect(
      sut.lookup({
        path: '/repos/rayepps/exobase-js/unknown/path/1',
        method: '*'
      }).handler
    ).toBeNull()
  })
})
