import express from 'express'
import type { Request, Response } from 'express'
import bodyParser from 'body-parser'
import _ from 'radash'
import path from 'path'
import fs from 'fs'
import type { FrameworkMapper } from './frameworks/types'
import expressFrameworkMapper from './frameworks/express'

export type { FrameworkMapper } from './frameworks/types'
export { default as expressFrameworkMapper } from './frameworks/express'
export { default as lambdaFrameworkMapper } from './frameworks/lambda'
export { default as vercelFrameworkMapper } from './frameworks/vercel'


type ModuleFunction = {
  function: string
  module: string
}

type ModuleFunctionLocation = ModuleFunction & {
  paths: {
    import: string
    file: string
  }
}

type ModuleFunctionSource = ModuleFunction & {
  func: Function
}


/**
 * Looks in ./src/modules for your modules and
 * functions. Returns their names and locations
 * as an array.
 */
export function getFunctionMap(rootPath: string): ModuleFunctionLocation[] {
  const relPath = (rel: string) => path.join(rootPath, rel)
  const modules = fs.readdirSync(relPath('/src/modules'), { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(m => {
      return fs.readdirSync(relPath(`/src/modules/${m.name}`), { withFileTypes: true })
        .filter(item => !item.isDirectory())
        .filter(item => item.name.endsWith('.ts'))
        .map(tsFile => {
          const funcName = tsFile.name.replace(/\.ts$/, '')
          return {
            function: funcName,
            module: m.name,
            paths: {
              file: relPath(`/src/modules/${m.name}/${tsFile.name}`),
              import: relPath(`/src/modules/${m.name}/${funcName}`)
            }
          }
        }) as ModuleFunctionLocation[]
    })
  return _.flat(modules)
}

export async function start({
  port = '8000',
  framework = expressFrameworkMapper,
  json: useJson = true,
  functions = []
}: {
  port?: string
  framework?: FrameworkMapper
  json?: boolean
  functions: ModuleFunctionSource[]
}, cb?: (port: number) => void) {

  const api = express()
  if (useJson) api.use(bodyParser.json())

  const mapped = (func: Function) => async (req: Request, res: Response) => {
    const args = await framework.mapRequestToArgs(req, res)
    const result = await func(...args)
    framework.mapResultToRes(req, res, result)
  }

  // Add each endpoint to the local running 
  // express app
  for (const f of functions) {
    console.log(`> POST /${f.module}/${f.function}`)
    api.all(`/${f.module}/${f.function}`, mapped(f.func))
  }

  // Get it poppin bebe
  const p = parseInt(port)
  api.listen(p, () => {
    cb?.(p)
  })

}