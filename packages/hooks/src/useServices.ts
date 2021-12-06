import _ from 'radash'
import type { Props, ApiFunction } from '@exobase/core'


export async function withServices(func: ApiFunction, services: Record<string, any>, props: Props) {
    return await func({
        ...props,
        services: {
            ...props.services,
            ...services
        }
    })
}

export const useService = <TServices = Record<string, any>> (services: TServices) => (func: ApiFunction) => _.partial(withServices, func, services)
