import { error } from '@exobase/core'
import { useRoute } from '@exobase/hooks'
import http from 'http'
import { compose, toInt } from 'radash'
import superagent from 'superagent'
import config from './config'
import callCallbacks from './endpoints/cron/call-callbacks'
import ping from './endpoints/ping'
import clearTimeout from './endpoints/v1/timeout/clear'
import createTimeout from './endpoints/v1/timeout/create'
import findTimeout from './endpoints/v1/timeout/find'
import listTimeouts from './endpoints/v1/timeout/list'
import { useHttp } from './useHttp'

const port = toInt(process.env.PORT, 8500)

const server = http.createServer(
  compose(
    useHttp(),
    useRoute('*', '/ping', ping),
    useRoute('PUT', '/v1/timeout/*/clear', clearTimeout),
    useRoute('POST', '/v1/timeout', createTimeout),
    useRoute('GET', '/v1/timeout/*', findTimeout),
    useRoute('GET', '/v1/timeout', listTimeouts),
    useRoute('POST', '/cron/call-callbacks', callCallbacks),
    async () => {
      throw error({
        status: 404,
        message: 'Not found'
      })
    }
  )
)

// When deployed, this would happen via some
// scheduled infrastructure
setInterval(() => {
  superagent
    .post(`http://localhost:${port}/cron/call-callbacks`)
    .set('X-Api-Key', `Key ${config.auth.apiKey}`)
    .end()
}, 1000)

server.listen(port, () => {
  console.log(`Callback API listening on port ${port}`)
})
