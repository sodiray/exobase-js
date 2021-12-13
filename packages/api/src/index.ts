import _ from 'radash'
import axios from 'axios'


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

export const fetcher = <TRequestBody, TResponseJson> ({
  baseUrl,
  module,
  function: functionName
}: {
  baseUrl: string
  module: string
  function: string
}) => async (data: TRequestBody, auth?: Auth): Promise<{ error: ApiError, data: TResponseJson }> => {
  const fullUrl = `${baseUrl}/${module}/${functionName}`
  const [netErr, response] = await _.try(() => axios.post(fullUrl, data, {
    headers: {
      'content-type': 'application/json',
      ...(auth?.token ? {
        'authorization': `Bearer ${auth.token}`
      } : {}),
      ...(auth?.key ? {
        'authorization': `Key ${auth.key}`
      } : {})
    }
  }))()
  if (netErr) {
    console.error(netErr)
  }
  if (netErr || !response) {
    return { error: {
      message: 'Network Error',
      details: 'There was an issue using the network.'
    }, data: null }
  }
  const json = response.data
  if (json.error) {
    console.error(json.error)
    return { error: json.error, data: json }
  }
  return { error: null, data: json }
}

const api = (baseUrl: string) => _.partob(fetcher, { baseUrl })

export default api
