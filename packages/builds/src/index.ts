import _ from 'radash'
import fs from 'fs-extra'
import path from 'path'


export type Function = {
  name: string
  module: string
  path: string
  route: string
}

export type ModuleFunction = {
  function: string
  module: string
  paths: {
    import: string
    file: string
  }
}

type LanguageExtension = 'ts' | 'py' | 'go' | 'cs' | 'js' | 'swift'

/**
 * Looks in ./src/modules for your modules and
 * functions. Returns their names and locations
 * as an array.
 */
export function getFunctionMap({
  path: rootPath,
  ext
}: {
  path: string
  ext: LanguageExtension
}): ModuleFunction[] {
  const relPath = (rel: string) => path.join(rootPath, rel)
  const modules = fs.readdirSync(relPath('/src/modules'), { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(m => {
      return fs.readdirSync(relPath(`/src/modules/${m.name}`), { withFileTypes: true })
        .filter(item => !item.isDirectory())
        .filter(item => item.name.endsWith(`.${ext}`))
        .map(tsFile => {
          const funcName = tsFile.name.replace(`.${ext}`, '')
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

export default {
  getFunctionMap
}