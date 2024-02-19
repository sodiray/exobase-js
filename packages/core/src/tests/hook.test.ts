import { test } from '@jest/globals'
import { compose } from '../compose'
import { hook } from '../hook'
import type { Props } from '../types'

test('props stop gap', async () => {
  const func = compose(
    useApiKey('donttell'),
    useLog(),
    useNamedFunc('test'),
    useRoute(),
    async props => {
      expect(props.auth.secret).toBe('donttell')
      return 'success'
    }
  )
  expect(await func({} as Props)).toBe('success')
})

const useApiKey = (secret: string) =>
  hook<Props, Props<{}, {}, { secret: string }>>(func => async props => {
    return await func({
      ...props,
      auth: { secret }
    })
  })

const useLog = () =>
  hook(func => async props => {
    return await func(props)
  })

const useNamedFunc = (name: string) =>
  hook(func => async props => {
    return await func(props)
  })

const useRoute = () =>
  hook(func => async props => {
    return await func(props)
  })
