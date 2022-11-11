import { describe, expect, test } from '@jest/globals'
import { makeRequest } from '../useLambda'

describe('makeRequest', () => {
  test('returns correct request object given event and context', () => {
    const event = {
      path: '/hello',
      headers: {
        'Api-Key': 'Key hello',
        authorization: 'Bearer 1234'
      },
      isBase64Encoded: false,
      body: JSON.stringify({ message: 'hello' }),
      requestContext: {
        httpMethod: 'POST',
        http: {
          sourceIp: '55.0.0.55'
        }
      },
      queryStringParameters: {
        id: '1234'
      }
    }
    const context = { name: 'lambda' }
    const result = makeRequest(event as any, context as any)
    expect(result.headers['api-key']).toBe('Key hello')
    expect(result.headers['authorization']).toBe('Bearer 1234')
    expect(result.url).toBe('/hello')
    expect(result.path).toBe('/hello')
    expect(result.body).toStrictEqual({ message: 'hello' })
    expect(result.method).toBe('POST')
    expect(result.query).toStrictEqual({
      id: '1234'
    })
    expect(result.ip).toBe('55.0.0.55')
  })
})
