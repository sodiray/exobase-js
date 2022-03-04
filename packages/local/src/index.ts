import express from 'express'
import type { Request, Response } from 'express'
import type { Server } from 'http'
import bodyParser from 'body-parser'
import _ from 'radash'
import path from 'path'
import fs from 'fs'
import type { FrameworkMapper } from './frameworks/types'
import expressFrameworkMapper from './frameworks/express'
import chalk from 'chalk'

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
export function getFunctionMap({
  moduleDirectoryPath,
  extensions = ['.ts']
}: {
  moduleDirectoryPath: string,
  extensions?: string[]
}): ModuleFunctionLocation[] {
  const relPath = (rel: string) => path.join(moduleDirectoryPath, rel)
  const modules = fs.readdirSync(moduleDirectoryPath, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(m => {
      return fs.readdirSync(relPath(m.name), { withFileTypes: true })
        .filter(item => !item.isDirectory())
        .filter(item => extensions.some(ext => item.name.endsWith(ext)))
        .map(filePath => {
          const funcName = filePath.name.replace(path.extname(filePath.name), '')
          return {
            function: funcName,
            module: m.name,
            paths: {
              file: relPath(`${m.name}/${filePath.name}`),
              import: relPath(`${m.name}/${funcName}`)
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
}, cb?: (port: number) => Server) {

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
    api.all(`/${f.module}/${f.function}`, mapped(f.func))
  }
  
  // Log about it
  const functionsByModule = Object.values(_.group(functions, f => f.module))
  for (const [moduleIdx, funcsInModule] of functionsByModule.entries()) {
    const color = colorAtIdx(moduleIdx)
    for (const f of funcsInModule) {
      console.log(`${chalk.gray('|—')} ${color('/' + f.module)}${chalk.gray('/' + f.function)}`)
    }
  }

  // Get it poppin bebe
  const p = parseInt(port)
  return api.listen(p, () => {
    cb?.(p)
  })

}

const colorAtIdx = (idx: number) => {
  const colors = [
    chalk.red.bind(chalk.red),
    chalk.blue.bind(chalk.blue),
    chalk.yellowBright.bind(chalk.yellowBright),
    chalk.magenta.bind(chalk.magenta),
    chalk.cyan.bind(chalk.cyan),
    chalk.green.bind(chalk.green)
  ]
  return colors[idx % colors.length]
}