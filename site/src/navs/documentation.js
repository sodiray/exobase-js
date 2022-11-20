export function importAll(r) {
  return r.keys().map((fileName) => ({
    fileName,
    module: r(fileName),
  }))
}

export function createPageList(files, base) {
  return importAll(files).reduce((acc, cur) => {
    let slug = cur.fileName.substr(2).replace(/\.mdx$/, '')
    return {
      ...acc,
      [slug]: { ...cur.module.default, href: `/${base}/${slug}` },
    }
  }, {})
}


const { files, groups } = require('../pages/docs/manifest.json')
const pages = createPageList(
  require.context(`../pages/docs/?meta=title,group,location`, false, /\.mdx$/),
  'docs'
)

export const documentationNav = groups.reduce((acc, group) => ({
  ...acc,
  [group]: files[group].map(fileName => pages[fileName.replace(/\.mdx$/, '')])
}), {})
