import fs from 'fs'
import glob from 'glob'
import parse from 'minimist'
import { join } from 'path'
import { parallel, sift, tryit } from 'radash'

type Args = {
  debug?: boolean
}

/**
 * This array determines the order of nav
 * groups in the site's left nav bar.
 */
export const groups = [
  'Getting Started',
  'Packages',
  'Root Hooks',
  'Hooks',
  'Init Hooks'
]

const run = async ({ debug = false }: Args) => {
  await tryit(fs.promises.mkdir)('site/src/pages/docs')
  const packageDocs = await parallel(
    6,
    glob.sync('packages/@exobase/*/*.{md,mdx}'),
    async relPath => {
      const p = Path(relPath)
      if (p.isLicense()) return
      const pack = await p.package()
      const dest = p.inDocs(`site/src/pages/docs/${p.packageDir}.mdx`)
      const content = await p.read()

      const md = `${header({
        title: pack.exobaseDocs.name,
        description: `The Exobase ${pack.exobaseDocs.name} ${
          pack.exobaseDocs.group.toLowerCase().includes('hook')
            ? 'hook'
            : 'package'
        }`,
        group: pack.exobaseDocs.group,
        location: p.repoPath
      })}
${content}
${footer()}
    `
      if (debug) {
        console.log({ dest }, `\n${md}`)
      } else {
        await fs.promises.writeFile(dest, md, 'utf-8')
      }

      return {
        group: pack.exobaseDocs.group,
        file: `${p.packageDir}.mdx`
      }
    }
  )
  const docDocs = await parallel(
    6,
    glob.sync('./documentation/*.{md,mdx}'),
    async relPath => {
      const p = Path(relPath)
      const dest = p.inDocs(`site/src/pages/docs/${p.fileName}`)
      const content = await p.read()
      if (debug) {
        console.log({ dest }, `\n${content}`)
      } else {
        await fs.promises.writeFile(dest, content, 'utf-8')
      }
      const group = /group:\s"(.+?)"/.exec(content)?.[1]
      if (!group) {
        throw `The mdx doc ${p.fileName} requires a group`
      }
      return {
        group,
        file: p.fileName
      }
    }
  )

  const manifest = {
    groups,
    files: sift([...packageDocs, ...docDocs]).reduce(
      (acc, doc) => ({
        ...acc,
        [doc.group]: [...(acc[doc.group] ?? []), doc.file]
      }),
      {} as Record<string, string[]>
    )
  }

  await fs.promises.writeFile(
    join(process.cwd(), 'site/src/pages/docs/manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf-8'
  )
}

const header = ({
  title,
  description,
  group,
  location
}: {
  title: string
  description: string
  group: string
  location: string
}) => `---
title: "${title}"
description: "${description}"
group: "${group}"
location: "${location}"
---

`

const footer = () => ``

const Path = (relPath: string) => {
  const absPath = join(process.cwd(), relPath)
  const fileName = /([^\/]+?)\.(md|mdx|md|js|ts)$/.exec(absPath)![0]
  const repoPath = absPath.replace(/^.+\/exobase\-js\//, '')
  const packageDir =
    /packages\/\@exobase\/([^\/].+?)\//.exec(absPath)?.[1] ?? ''
  return {
    fileName,
    repoPath,
    packageDir,
    absPath,
    isLicense: () => fileName.toLowerCase() === 'license.md',
    package: async () => {
      const str = await fs.promises.readFile(
        absPath.replace(fileName, 'package.json'),
        'utf-8'
      )
      return JSON.parse(str)
    },
    inDocs: (relDocsPath: `site/${string}`) => {
      return absPath.replace(/\/exobase\-js\/.+/, `/exobase-js/${relDocsPath}`)
    },
    read: async () => {
      return await fs.promises.readFile(absPath, 'utf-8')
    }
  }
}

run(parse(process.argv) as unknown as Args)
