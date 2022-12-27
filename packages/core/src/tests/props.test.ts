import { expect, test } from '@jest/globals'
import { props } from '../props'

test('props stop gap', () => {
  expect(props).not.toBeNull()
})
