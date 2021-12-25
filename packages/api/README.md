# `@exobase/api`

> A library for creating clients that communicate with Exobase APIs

## Usage

```ts
import apiMaker from '@exobase/api'
import * as t from './types'

export { ApiError, ApiResponse, Auth } from '@exobase/api'
export * from './types'


const createApi = (url: string) => {
  const endpoint = apiMaker(url)
  return {
    health: {
      ping: endpoint<{}, {
        message: 'pong'
      }>({
        module: 'health',
        function: 'ping'
      })
    },
    auth: {
      login: endpoint<{}, {
        user: t.User
        platforms: t.PlatformPreview[]
        platformId: string
        idToken: string
        exp: number
      }>({
        module: 'auth',
        function: 'login'
      })
    }
  }
}

const api = createApi('http://localhost:800')

await api.health.ping({})
const { error, data } = await api.auth.login({}, {
  token: 'abc=='
})
```
