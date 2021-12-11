import minimist from 'minimist'
import run from './index'

import type { FrameworkMapper } from './frameworks/types'
import localizeExpress from './frameworks/express'
import localizeVercel from './frameworks/vercel'
import localizeLambda from './frameworks/lambda'

const FRAMEWORK_MAPPERS: Record<string, FrameworkMapper> = {
  'express': localizeExpress,
  'vercel': localizeVercel,
  'lambda': localizeLambda
}

const start = async ({
  p, port,
  j, json: useJson,
  f, framework = 'express'
}: {
  p?: string
  port?: string
  f?: string
  framework?: string
  j?: boolean
  json?: boolean
}) => run({
  port: p ?? port,
  json: j ?? useJson,
  framework: FRAMEWORK_MAPPERS[f ?? framework]
}, (port: number) => {
  console.log(`Service running on http://localhost:${port}`)
})

start(minimist(process.argv) as any).catch((err) => {
  console.error(err)
  process.exit(1)
})