/// <reference types="./js-yaml" />

import _ from 'radash'
import Yaml from 'js-yaml'
import fs from 'fs-extra'
import * as t from './types'

const defaultConfig = {
  services: []
}

export const parse = async (configFilePath: string): Promise<t.ExobaseConfiguration> => {
  const [err, ymlString] = await _.try(() => {
    return fs.readFile(configFilePath, 'utf-8')
  })()
  if (err) {
    return defaultConfig
  }
  const hcl = Yaml.load(ymlString)
  if (!hcl || !hcl.services) {
    return defaultConfig
  }
  return {
    services: hcl.services.map(mapService)
  }
}

const mapService = (obj: any) => {
  return {
    ...obj,
    on: (obj.on ?? []).map(mapOnConfigs)
  }
}

const mapOnConfigs = (obj: any) => {
  const [provider, service] = obj.service.split(':')
  return {
    ...obj,
    key: obj.service,
    provider,
    service
  }
}
