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
        children: [
          {
            path: 'repos',
            handlers: {},
            children: [
              {
                path: '*',
                handlers: {},
                children: [
                  {
                    path: '*',
                    handlers: {},
                    children: [
                      {
                        path: 'stars',
                        handlers: {
                          GET: getStars
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

      const result = addNode(
        current,
        'GET',
        '/repos/*/*/contributors',
        getContributors
      )
      const expected: Trie = {
        path: '/',
        handlers: {},
        children: [
          {
            path: 'repos',
            handlers: {},
            children: [
              {
                path: '*',
                handlers: {},
                children: [
                  {
                    path: '*',
                    handlers: {},
                    children: [
                      {
                        path: 'stars',
                        handlers: {
                          GET: getStars
                        },
                        children: []
                      },
                      {
                        path: 'contributors',
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
          handlers: {}
        },
        'GET',
        '/repos/*/*/stars',
        handler
      )
      const expected: Trie = {
        path: '/',
        handlers: {},
        children: [
          {
            path: 'repos',
            handlers: {},
            children: [
              {
                path: '*',
                handlers: {},
                children: [
                  {
                    path: '*',
                    handlers: {},
                    children: [
                      {
                        path: 'stars',
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
