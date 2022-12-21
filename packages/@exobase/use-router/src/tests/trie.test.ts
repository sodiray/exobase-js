import { describe, expect, jest, test } from '@jest/globals'
import { addNode, Trie } from '../trie'

describe('trie module', () => {
  describe('addNode function', () => {
    test('adds node to existing trie correctly', () => {
      const getStars = jest.fn()
      const getContributors = jest.fn()
      const current: Trie = {
        path: '/',
        handlers: {},
        parser: null,
        children: [
          {
            path: 'repos',
            handlers: {},
            parser: null,
            children: [
              {
                path: '*',
                handlers: {},
                parser: null,
                children: [
                  {
                    path: '*',
                    handlers: {},
                    parser: null,
                    children: [
                      {
                        path: 'stars',
                        handlers: {
                          GET: getStars
                        },
                        children: [],
                        parser: null
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }

      const result = addNode(
        current,
        'GET',
        '/repos/{owner}/{repo}/contributors',
        getContributors
      )
      const expected: Trie = {
        path: '/',
        handlers: {},
        parser: null,
        children: [
          {
            path: 'repos',
            handlers: {},
            parser: null,
            children: [
              {
                path: '*',
                handlers: {},
                parser: null,
                children: [
                  {
                    path: '*',
                    handlers: {},
                    parser: null,
                    children: [
                      {
                        path: 'stars',
                        parser: expect.any(Object) as any,
                        handlers: {
                          GET: getStars
                        },
                        children: []
                      },
                      {
                        path: 'contributors',
                        parser: expect.any(Object) as any,
                        handlers: {
                          GET: getContributors
                        },
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
      expect(result).toEqual(expected)
    })
    test('adds node to empty trie correctly', () => {
      const handler = jest.fn()
      const result = addNode(
        {
          path: '/',
          children: [],
          handlers: {},
          parser: null
        },
        'GET',
        '/repos/{owner}/{repo}/stars',
        handler
      )
      const expected: Trie = {
        path: '/',
        handlers: {},
        parser: null,
        children: [
          {
            path: 'repos',
            handlers: {},
            parser: null,
            children: [
              {
                path: '*',
                handlers: {},
                parser: null,
                children: [
                  {
                    path: '*',
                    handlers: {},
                    parser: null,
                    children: [
                      {
                        path: 'stars',
                        parser: expect.any(Object) as any,
                        handlers: {
                          GET: handler
                        },
                        children: []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
      expect(result).toEqual(expected)
    })
  })
})
