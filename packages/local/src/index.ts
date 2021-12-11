/* eslint-disable @typescript-eslint/no-var-requires */
import _ from 'radash'
import express, { Request, Response } from 'express'
import { json } from 'body-parser'
import fs from 'fs'
import type { FrameworkMapper } from './frameworks/types'
import expresFrameworkMapper from './frameworks/express'

type Args = {
  port?: string
  framework?: FrameworkMapper
  json?: boolean
}

type ModuleFunction = {
  function: string
  module: string
  paths: {
    import: string
    file: string
  }
}

export default async function run({
  port = '8000',
  framework = expresFrameworkMapper,
  json: useJson = true
}: Args, cb?: (port: number) => void) {

  const api = express()
  if (useJson) api.use(json())

  const localized = (func: Function) => async (req: Request, res: Response) => {
    const args = await framework.mapRequestToArgs(req, res)
    const result = await func(...args)
    framework.mapResultToRes(req, res, result)
  }

  // Add each endpoint to the local running 
  // express app
  for (const f of getFunctionMap()) {
    const { default: func } = await import(f.paths.import)
    api.all(`/${f.module}/${f.function}`, localized(func))
  }

  // Get it poppin bebe
  const p = parseInt(port)
  api.listen(p, () => {
    cb?.(p)
  })

}


/**
 * Looks in ./src/modules for your modules and
 * functions. Returns their names and locations
 * as an array.
 */
function getFunctionMap(): ModuleFunction[] {
  const cwd = process.cwd()
  const relPath = (rel: string) => `${cwd}${rel}`
  const modules = fs.readdirSync(relPath('/src/modules'), { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(m => {
      return fs.readdirSync(relPath(`/src/modules/${m.name}`), { withFileTypes: true })
        .filter(item => !item.isDirectory())
        .filter(item => item.name.endsWith('.ts'))
        .map(tsFile => {
          const funcName = tsFile.name.replace(/\.ts^/, '')
          return {
            function: funcName,
            module: m.name,
            paths: {
              file: relPath(`/src/modules/${m.name}/${tsFile.name}`),
              import: relPath(`/src/modules/${m.name}/${funcName}`)
            }
          }
        }) as ModuleFunction[]
    })
  return _.flat(modules)
}