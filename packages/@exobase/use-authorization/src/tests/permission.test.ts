import { describe, expect, test } from '@jest/globals'
import { parse, stringify } from '../permission'
import { Permission } from '../types'

describe('permission', () => {
  test('stringify generates parseable string', () => {
    const p: Permission = {
      acl: 'allow',
      uri: 'com.github/rayepps/exobase-js/settings',
      scope: 'read',
      name: null
    }
    const str = stringify(p)
    const result = parse(str)
    expect(result).toEqual(p)
  })
})
