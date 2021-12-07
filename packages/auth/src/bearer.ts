import _ from 'radash'
import * as jwt from 'jsonwebtoken'
import * as exo from '@exobase/core'
import { Permission } from './permission'
import { Token } from './token'


export interface JWTAuthOptions {
    type?: 'id' | 'access'
    iss?: string
    permission?: Permission
    scope?: string
    extra?: Record<string, string | number | symbol>,
    tokenSignatureSecret: string
}

const validateClaims = (decoded: Token, options: JWTAuthOptions) => {
    const { type, iss, permission, scope, extra = {} } = options
    if (permission) {
        if (!decoded.permissions || !decoded.permissions.includes(permission.key)) {
            throw exo.errors.forbidden({
                details: 'Given token does not have required permissions',
                key: 'exo.err.core.auth.capricornus'
            })
        }
    }

    if (scope) {
        if (!decoded.scopes || !decoded.scopes.includes(scope)) {
            throw exo.errors.forbidden({
                details: 'Given token does not have required scope',
                key: 'exo.err.core.auth.caprinaught'
            })
        }
    }

    if (type) {
        if (!decoded.type || decoded.type !== type) {
            throw exo.errors.forbidden({
                details: 'Given token does not have required type',
                key: 'exo.err.core.auth.caprorilous'
            })
        }
    }

    if (iss) {
        if (!decoded.iss || decoded.iss !== iss) {
            throw exo.errors.forbidden({
                details: 'Given token does not have required issuer',
                key: 'exo.err.core.auth.caprisaur'
            })
        }
    }
    if (!extra) return
    for (const [key, value] of Object.entries(extra)) {
        if (decoded[key] !== value) {
            throw exo.errors.forbidden({
                details: `Given token does not have required ${key}`,
                key: 'exo.err.core.auth.extraterra'
            })
        }
    }
}


const verifyToken = async (token: string, secret: string): Promise<{ err: Error | null, decoded: Token }> => {
    const [err, decoded] = await new Promise(res => {
        jwt.verify(token, secret, (e, d) => res([e, d]))
    })
    return { err, decoded }
}

export async function requireAuthorizedToken(func: exo.ApiFunction, options: JWTAuthOptions, props: exo.Props) {
    const header = props.req.headers['authorization'] as string
    if (!header) {
        throw exo.errors.unauthorized({
            details: 'This function requires authentication via a token',
            key: 'exo.err.core.auth.canes-venatici'
        })
    }

    if (!header.startsWith('Bearer ')) {
        throw exo.errors.unauthorized({
            details: 'This function requires an authentication via a token',
            key: 'exo.err.core.auth.canes-veeticar'
        })
    }

    const bearerToken = header.replace('Bearer ', '')

    const { err, decoded } = await verifyToken(bearerToken, options.tokenSignatureSecret)

    if (err) {
        console.error('Inavlid token', { err }, 'r.log.core.auth.beiyn')
        throw exo.errors.forbidden({
            details: 'Cannot call this function without a valid authentication token',
            key: 'exo.err.core.auth.canis-major'
        })
    }

    validateClaims(decoded, options)

    return await func({
        ...props,
        auth: {
            ...props.auth,
            token: decoded
        }
    })
}

export type TokenAuth<ExtraData = any> = {
    token: Token<ExtraData>
}

export const useTokenAuthentication = (options: JWTAuthOptions) => (func: exo.ApiFunction) => {
    return _.partial(requireAuthorizedToken, func, options)
}
