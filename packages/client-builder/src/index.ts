import { try as tryit } from 'radash'
import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'

export interface ApiError {
  message: string
  details: string
}

export interface ApiResponse<T> {
  error: ApiError | null
  data: T
}

export interface Auth {
  token?: string
  key?: string
}

export interface Options {
  configure?: (options: AxiosRequestConfig) => AxiosRequestConfig
}

const api = (base: string, apiOptions?: Options) => {
  return (endpoint: string, endpointOptions?: Options) => {
    return request({
      url: `${base}${endpoint}`,
      ...apiOptions,
      ...endpointOptions
    })
  }
}

export const request = <TRequestBody, TResponseJson>({
  url,
  configure = (x) => x
}: Options & {
  url: string
}) => async (data: TRequestBody, auth?: Auth): Promise<{ error: ApiError, data: TResponseJson }> => {
  const options: AxiosRequestConfig<TRequestBody> = {
    headers: {
      'content-type': 'application/json',
      ...(auth?.token ? {
        'authorization': `Bearer ${auth.token}`
      } : {}),
      ...(auth?.key ? {
        'x-api-key': `Key ${auth.key}`
      } : {})
    }
  }
  const [netErr, response] = await tryit(() => {
    return axios.post(url, data, configure(options))
  })() as [AxiosError, AxiosResponse<any, any>]
  if (netErr) {
    console.error(netErr)
    // If the error contains a json body that
    // also contains a valid error
    if (netErr.response?.data?.error) {
      return {
        data: null,
        error: netErr.response?.data?.error
      }
    }
    return {
      data: null,
      error: {
        message: 'Network Error',
        details: 'There was an issue using the network.'
      }
    }
  }
  if (response.data.error) {
    return {
      data: null,
      error: response.data.error
    }
  }
  return {
    data: response.data.result,
    error: null
  }
}

export default api
