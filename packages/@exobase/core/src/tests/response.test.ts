import { expect, test } from '@jest/globals'
import { defaultResponse } from '../response'

test('response stop gap', () => {
  expect(defaultResponse).not.toBeNull()
})
