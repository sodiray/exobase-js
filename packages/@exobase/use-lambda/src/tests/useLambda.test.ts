import { describe, expect, jest, test } from '@jest/globals'
import { useLambda } from '../index'
import { makeRequest } from '../useLambda'

describe('useLambda hook', () => {
  test('calls endpoint', async () => {
    const sut = useLambda()
    const mockEndpoint = jest.fn(props => props)
    const result = await sut(mockEndpoint as any)(
      {
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
          },
          protocol: 'HTTPS/1.1'
        },
        queryStringParameters: {
          id: '1234'
        }
      } as any,
      {
        id: 'aws.context'
      } as any
    )
    expect(mockEndpoint).toBeCalledTimes(1)
  })
})

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
        },
        protocol: 'HTTPS/1.1'
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
