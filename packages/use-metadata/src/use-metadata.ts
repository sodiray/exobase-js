import { Props } from '@exobase/core'

export const useMetadata = <TMetadata extends {}>(
  properties: TMetadata
) => (func: (props: Props) => any): ({ (props: Props): any } & TMetadata) => {
  const handler = (props: Props) => func(props)
  for (const key of Object.keys(properties)) {
    (handler as any)[key] = (properties as any)[key]
  }
  return handler as any
}
