import _ from 'radash'
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

export const fetcher = <TRequestBody, TResponseJson>({
  baseUrl,
  module,
  function: functionName,
  configure = (x) => x
}: {
  baseUrl: string
  module: string
  function: string
  configure?: (options: AxiosRequestConfig<TRequestBody>) => AxiosRequestConfig<TRequestBody>
}) => async (data: TRequestBody, auth?: Auth): Promise<{ error: ApiError, data: TResponseJson }> => {
  const fullUrl = `${baseUrl}/${module}/${functionName}`
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
  const [netErr, response] = await _.try(() => axios.post(fullUrl, data, configure(options)))() as [AxiosError, AxiosResponse<any, any>]
  if (netErr) {
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

const api = (baseUrl: string, configure?: (options: AxiosRequestConfig) => AxiosRequestConfig) => _.partob(fetcher, { baseUrl, configure })

export default api
