import { AbstractRequest, Props } from '@exobase/core'
import { test } from '@jest/globals'
import { withApiKey } from '../useApiKey'

test('withApiKey does not throw error given valid key', async () => {
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

test('withApiKey throws error when api key is missing', async () => {
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

test('withApiKey throws error when api key does not match', async () => {
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
