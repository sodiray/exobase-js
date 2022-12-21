import { describe, expect, test } from '@jest/globals'
import { ParamParser } from '../param-parser'

describe('PathParams', () => {
  const workspace = 'w1'
  const account = 'a1'

  const request = {
    path: `/v1/show/${workspace}/account/${account}/details`
  }

  test('returns parsed params', async () => {
    const parser = ParamParser('/v1/show/{workspace}/account/{account}/details')
    expect(parser.parse(request.path)).toStrictEqual({
      workspace,
      account
    })
  })

  test('returns all found params even if path does not fully match', () => {
    const p = (template: string) => ParamParser(template).parse(request.path)
    expect(p('/v1/show/{workspace}/account/{account}')).toStrictEqual({
      workspace,
      account
    })
    expect(p('/v1/show/{workspace}')).toStrictEqual({
      workspace
    })
    expect(p('/v1/show/{workspace}/account')).toStrictEqual({
      workspace
    })
    expect(p('/v1/show')).toStrictEqual({})
  })
})
