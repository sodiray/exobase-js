import { defaultResponse } from '@exobase/core'
import { describe, expect, jest, test } from '@jest/globals'
import { LogEngine, useLogging } from '../useLogging'

describe('useLogging hook', () => {
  test('logs format given next functions result', async () => {
    const mockLog = jest.fn()
    const mockError = jest.fn()
    const sut = useLogging(':status :path :referrer', {
      logger: {
        log: mockLog,
        error: mockError
      }
    })
    const result = await sut(async () => defaultResponse)({
      request: {
        method: 'POST',
        startedAt: Date.now() - 1000,
        url: 'exobase.dev',
        path: '/ping',
        headers: {
          referrer: 'myself'
        }
      },
      response: defaultResponse
    } as any)
    expect(result).toEqual(defaultResponse)
    expect(mockLog).toBeCalledWith('200 /ping myself')
  })
})

describe('LogEngine object', () => {
  describe('parse function', () => {
    test('returns tokenized list for format string', () => {
      const result = LogEngine.parse(':status :date(iso)')
      expect(result.length).toBe(2)
      expect(result[0]).toEqual({
        token: 'status',
        raw: ':status',
        args: [],
        calls: false
      })
      expect(result[1]).toEqual({
        token: 'date',
        raw: ':date(iso)',
        args: ['iso'],
        calls: true
      })
    })
  })

  describe('template function', () => {
    test('returns formated template with token funcs', () => {
      const result = LogEngine.template(
        ':status :date(iso)',
        [
          {
            token: 'status',
            raw: ':status',
            args: [],
            calls: false
          },
          {
            token: 'date',
            raw: ':date(iso)',
            args: ['iso'],
            calls: true
          }
        ],
        {
          status: () => '200',
          date: (fmt: string) => `+${fmt}`
        }
      )
      expect(result).toBe('200 +iso')
    })
  })
  test('works e2e with complex format and args', () => {
    const template =
      '[:method] :path at :date(iso) -> :status in :elapsed(ms, ms)|:query-args :elapsed'
    const result = LogEngine.template(template, LogEngine.parse(template), {
      method: () => 'POST',
      path: () => '/ping',
      date: (fmt: string) => `+${fmt}`,
      status: () => '201',
      elapsed: (dur?: string, sfx?: string) => {
        if (!dur && !sfx) return '100'
        return dur === 'ms' ? `200${sfx}` : `100${sfx}`
      },
      'query-args': () => 'cache=1&id=23'
    })
    expect(result).toEqual(
      '[POST] /ping at +iso -> 201 in 200ms|cache=1&id=23 100'
    )
  })
})
