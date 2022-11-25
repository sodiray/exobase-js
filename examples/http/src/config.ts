import { v4 as uuid } from 'uuid'

const config = {
  auth: {
    apiKey: process.env.AUTH_API_KEY ?? `cb.key.${uuid().replace(/\-/g, '')}`
  }
}

export type Config = typeof config

export default config
