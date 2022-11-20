import fs from 'fs/promises'
import glob from 'glob'
import parse from 'minimist'
import { join } from 'path'
import { omit, parallel, sift, sort, toInt, tryit } from 'radash'

type Args = {
  dry?: boolean
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

const rel = (path: string) => join(__dirname, path)

const run = async ({ dry = false, debug = false }: Args) => {
  await tryit(fs.mkdir)(rel('../site/src/pages/docs'))
  await tryit(clean)(rel('../site/src/pages/docs'))
  const packageDocs = await parallel(
    6,
    glob.sync(rel('../packages/@exobase/*/*.{md,mdx}')),
    async absPath => {
      const p = Path(absPath)
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
      if (dry) {
        console.log({ dest }, `\n${md}`)
      } else {
        console.log(`[WRITE]: ${dest}`, { markdown: md.slice(0, 15) })
        await fs.writeFile(dest, md, 'utf-8')
      }

      return {
        group: pack.exobaseDocs.group,
        file: `${p.packageDir}.mdx`
      }
    }
  )
  const docDocs = await parallel(
    6,
    glob.sync(rel('./*.{md,mdx}')),
    async absPath => {
      const p = Path(absPath)
      const dest = p.inDocs(`site/src/pages/docs/${p.fileName}`)
      const md = await p.read()
      if (dry) {
        console.log({ dest }, `\n${md}`)
      } else {
        console.log(`[WRITE]: ${dest}`, { markdown: md.slice(0, 15) })
        await fs.writeFile(dest, md, 'utf-8')
      }
      const group = /group:\s["'](.+?)["']/.exec(md)?.[1]
      const order = toInt(/order:\s(.+?)\n/.exec(md)?.[1], 0)
      if (!group) {
        throw `The mdx doc ${p.fileName} requires a group`
      }
      return {
        group,
        file: p.fileName,
        order
      }
    }
  )

  const otherDocs = sort(docDocs, d => d.order).map(d => omit(d, ['order']))

  const manifest = {
    groups,
    files: sift([...packageDocs, ...otherDocs]).reduce(
      (acc, doc) => ({
        ...acc,
        [doc.group]: [...(acc[doc.group] ?? []), doc.file]
      }),
      {} as Record<string, string[]>
    )
  }

  if (debug) {
    console.log(JSON.stringify(manifest, null, 2))
  }

  await fs.writeFile(
    rel('../site/src/pages/docs/manifest.json'),
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

const Path = (absPath: string) => {
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
      const str = await fs.readFile(
        absPath.replace(fileName, 'package.json'),
        'utf-8'
      )
      return JSON.parse(str)
    },
    inDocs: (relDocsPath: `site/${string}`) => {
      return rel(`../${relDocsPath}`)
    },
    read: async () => {
      return await fs.readFile(absPath, 'utf-8')
    }
  }
}

const clean = async (dir: string) => {
  for (const file of await fs.readdir(dir)) {
    await fs.unlink(join(dir, file))
  }
}

run(parse(process.argv) as unknown as Args)
