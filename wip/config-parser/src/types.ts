import type {
  ExobaseService,
  CloudProvider,
  CloudService
} from '@exobase/client-js'


export type ExobaseConfiguration = {
  services: ExobaseServiceConfiguration[]
}

export type ExobaseServiceConfiguration = {
  name: string
  type: ExobaseService
  functions?: string[]
  variables?: Record<string, string>
  secrets?: string[]
  on?: ExobaseProviderServiceConfig[]
}

export interface ExobaseProviderServiceConfig {
  key: `${CloudProvider}:${CloudService}`
  provider: CloudProvider
  service: CloudService
}