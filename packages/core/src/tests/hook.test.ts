import { test } from '@jest/globals'
import { compose } from 'radash'
import { hook } from '../hook'
import type { Props } from '../types'

test('props stop gap', () => {
  compose(useApiKey('secret'), useLog(), useNamedFunc('test'), useRoute())
})

type ApiKeyAuth = {
  apiKey: string
}

// Options + Extended Type
const useApiKey = (secret: string) =>
  hook<Props, Props<{}, {}, ApiKeyAuth>>(func => async props => {
    if (props.request.headers['x-api-key'] !== secret) {
      throw 'Failed auth'
    }
    const auth: ApiKeyAuth = {
      apiKey: secret
    }
    return await func({
      ...props,
      auth: {
        ...props.auth,
        ...auth
      }
    })
  })

// Simple No Options
const useLog = () =>
  hook(func => async props => {
    console.log(props.request)
    return await func(props)
  })

// Simple No Options
const useNamedFunc = (name: string) =>
  hook(func => async props => {
    console.log('running: ' + name)
    return await func(props)
  })

// Precompute Work
const useRoute = () =>
  hook(func => {
    const tree = {}
    return async props => {
      return await func(props)
    }
  })
