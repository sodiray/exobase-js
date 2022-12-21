type TemplateSegment = {
  raw: string
  isVariable: boolean
  name: string | null
  index: number
}

export const ParamParser = (
  /**
   * The developer provided path with named
   * parameter templates.
   *
   * @example
   * /libraries/{library}/books/{book}/checkout
   */
  template: string
) => {
  const templateParts: TemplateSegment[] = template
    .split('/')
    .map((raw, index) => {
      const isVar = raw.match(/^{[^\/]+}$/)
      return {
        raw,
        isVariable: !!isVar,
        name: isVar ? raw.substring(1, raw.length - 1) : null,
        index
      }
    })
  return {
    parse: (
      /**
       * The actual runtime url path that is being
       * called.
       *
       * @example
       * /library/ny-public-library/books/art-of-war/checkout
       */
      path: string
    ): Record<string, string> => {
      const params: Record<string, string> = {}
      const pathParts = path.split('/')
      for (const segment of templateParts) {
        const pathPart = pathParts[segment.index]
        if (segment.isVariable) {
          params[segment.name!] = pathPart
          continue
        }
        if (segment.raw !== pathPart) {
          return params
        }
      }
      return params
    }
  }
}

export type ParamParser = ReturnType<typeof ParamParser>
