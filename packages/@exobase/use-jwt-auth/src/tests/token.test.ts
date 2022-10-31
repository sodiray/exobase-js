import { expect, test } from '@jest/globals'
import { create } from '../token'

test('create token stop gap', () => {
  expect(create).not.toBeNull()
})
