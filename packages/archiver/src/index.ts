import _ from "radash"
import fs from "fs"
import path from "path"
import archiver from "archiver"
import asyncL from "async"
import globby from "globby"
import mkdirp from "mkdirp"

export default async function nodeArchive({
  source,
  destination,
  exclude = [],
  include = [],
  cwd = process.cwd()
}: {
  source: string // 'build/*'
  destination: string // './destination.zip'
  exclude?: string[] // ['destination.zip'],
  include?: string[] // ['.gitignore']
  cwd?: string
}) {
  const files = await getFiles({
    source,
    destination,
    exclude,
    include,
    cwd
  })
  if (!files.length) {
    throw Error("No files matched to zip.")
  }
  await zipFiles(files, {
    source,
    destination,
    exclude,
    include,
    cwd
  })
}

export const zipFiles = (files: string[], options: {
  source: string // 'build/*'
  destination: string // './destination.zip'
  exclude: string[] // ['destination.zip'],
  include: string[] // ['.gitignore']
  cwd: string
}) =>
  new Promise((resolve, reject) => {
    const outputPath = path.resolve(options.cwd, options.destination)
    if (!fs.existsSync(path.dirname(outputPath))) {
      mkdirp.sync(path.dirname(outputPath))
    }
    const output = fs.createWriteStream(outputPath)
    const archive = archiver("zip")
    output.on("close", resolve)
    archive.on("error", reject)
    archive.pipe(output)
    function addSource(source, next) {
      const fullPath = path.resolve(options.cwd, options.source, source)
      const destPath = source
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          return next(err)
        }
        if (stats.isFile()) {
          archive.file(fullPath, { stats: stats, name: destPath })
        }
        return next()
      })
    }
    asyncL.forEach(files, addSource, err => {
      if (err) {
        return reject(err)
      }
      archive.finalize()
    })
  })

async function getFiles(options: {
  source: string // 'build/*'
  destination: string // './destination.zip'
  exclude: string[] // ['destination.zip'],
  include: string[] // ['.gitignore']
  cwd: string
}) {
  const patterns = _.unique(["**", ...options.include])
  const globOptions = {
    dot: true,
    cwd: path.resolve(options.cwd, options.source),
    gitignore: true,
    ignore: _.unique([".git", ...options.exclude]).filter(el => !patterns.includes(el)),
    noglobstar: false,
    noext: true, // no (a|b)
    nobrace: true // no {a,b}
  }
  return await globby(patterns, globOptions)
}