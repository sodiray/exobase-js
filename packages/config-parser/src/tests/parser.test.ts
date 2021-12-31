import { parse } from '../parser'
import createTest from 'baretest'
import assert from 'assert'


const test = createTest('parser')

test('correctly generates expected json', async () => {  
  const result = await parse(`${__dirname}/config-in.yml`)
  const expected = require(`${__dirname}/config-expected.json`)
  assert.deepEqual(expected, result)
})

test('returns empty valid object if file does not exist', async () => {  
  const result = await parse(`${__dirname}/does-not-exist.yml`)
  const expected = {
    services: []
  }
  assert.deepEqual(expected, result)
})

test.run()