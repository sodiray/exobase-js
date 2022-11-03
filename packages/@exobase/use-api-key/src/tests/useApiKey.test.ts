import { AbstractRequest, Props } from '@exobase/core'
import { describe, test } from '@jest/globals'
import { useApiKey, withApiKey } from '../useApiKey'

describe('useApiKey hook', () => {
  test('calls withApiKey function', async () => {
    const mockFn = async (props: any) => props
    const mockProps: Pick<Props, 'request'> = {
      request: {
        headers: {
          'x-api-key': 'Key mock-secret'
        }
      } as unknown as AbstractRequest
    }
    const sut = useApiKey('mock-secret')
    await sut(mockFn)(mockProps as Props)
  })
})

describe('withApiKey function', () => {
  test('does not throw error given valid key', async () => {
    const mockFn = async (props: any) => props
    const mockProps: Pick<Props, 'request'> = {
      request: {
        headers: {
          'x-api-key': 'Key mock-secret'
        }
      } as unknown as AbstractRequest
    }
    await withApiKey(mockFn, 'mock-secret', mockProps as Props)
  })

  test('throws error when api key is missing', async () => {
    const mockFn = async (props: any) => props
    const mockProps: Pick<Props, 'request'> = {
      request: {
        headers: {
          /** no api key header **/
        }
      } as unknown as AbstractRequest
    }
    try {
      await withApiKey(mockFn, 'mock-secret', mockProps as Props)
    } catch (err) {
      return
    }
    throw new Error('Expected error to be thrown - apiKey should be required')
  })

  test('throws error when api key does not match', async () => {
    const mockFn = async (props: any) => props
    const mockProps: Pick<Props, 'request'> = {
      request: {
        headers: {
          'x-api-key': 'wrong-mock-secret'
        }
      } as unknown as AbstractRequest
    }
    try {
      await withApiKey(mockFn, 'mock-secret', mockProps as Props)
    } catch (err) {
      return
    }
    throw new Error('Expected error to be thrown - apiKey should match')
  })
})
