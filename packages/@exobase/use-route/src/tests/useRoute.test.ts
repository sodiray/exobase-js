import { describe, expect, test } from '@jest/globals'
import { isMatch } from '../useRoute'

describe('isMatch', () => {
  const request = {
    method: 'POST',
    path: '/go/to/dinner'
  }
  test('returns true for matching requests and keys', async () => {
    expect(isMatch(request, '*', '*')).toBe(true)
    expect(isMatch(request, '*', '/**')).toBe(true)
    expect(isMatch(request, '*', '/*/to')).toBe(true)
    expect(isMatch(request, '*', '/go/*/dinner')).toBe(true)
    expect(isMatch(request, '*', '/go/**')).toBe(true)
    expect(isMatch(request, '*', '/go/to/*')).toBe(true)
    expect(isMatch(request, '*', '/*/*/*')).toBe(true)
    expect(isMatch(request, '*', '/go/to/dinner')).toBe(true)
  })

  test('returns false for requests and keys that do not match', () => {
    expect(isMatch(request, '*', '/back/**')).toBe(false)
    expect(isMatch(request, '*', '/go/*/lunch')).toBe(false)
    expect(isMatch(request, '*', '/*/*/lunch')).toBe(false)
    expect(isMatch(request, '*', '/not/the/route')).toBe(false)
    expect(isMatch(request, '*', '/go/to/dinner/next')).toBe(false)
    expect(isMatch(request, '*', '/go/to/dinner/**')).toBe(false)
    expect(isMatch(request, 'GET', '*')).toBe(false)
  })
})
