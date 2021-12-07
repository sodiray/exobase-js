import _ from 'radash'
import * as exo from '@exobase/core'


type PropsGetter <T> = (props: exo.Props) => Promise<T>

export async function withApiKey(func: exo.ApiFunction, keyFunc: string | PropsGetter<string>, props: exo.Props) {
    const header = props.req.headers['x-api-key'] as string

    const key = !_.isFunction(keyFunc) ? keyFunc : await (keyFunc as PropsGetter<string>)(props)

    if (!header) {
        throw exo.errors.unauthorized({
            details: 'This function requires an api key',
            key: 'exo.err.core.auth.canes-venarias'
        })
    }

    const providedKey = header.startsWith('Key ') && header.replace('Key ', '')

    if (!key || !providedKey || providedKey !== key) {
        throw exo.errors.unauthorized({
            details: 'Invalid api key',
            key: 'exo.err.core.auth.balefeign'
        })
    }

    return await func(props)
}

export const useApiKeyAuthentication = (key: string | PropsGetter<string>) => (func: exo.ApiFunction) => {
    return _.partial(withApiKey, func, key)
}

