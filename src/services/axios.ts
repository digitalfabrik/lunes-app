import axios from 'axios'
import { buildKeyGenerator, setupCache } from 'axios-cache-interceptor'

import { addTrailingSlashToUrl } from './url'

const baseURL = __DEV__ ? 'https://lunes-test.tuerantuer.org/api' : 'https://lunes.tuerantuer.org/api'

const keyGenerator = buildKeyGenerator(({ headers, baseURL = '', url = '', method = 'get', params, data }) => ({
  url: baseURL + (baseURL && url ? '/' : '') + url,
  headers: headers?.Authorization ?? 'not-set',
  method,
  params: params as unknown,
  data
}))

setupCache(axios, {
  generateKey: keyGenerator
})

export const getFromEndpoint = async <T>(url: string, apiKey?: string): Promise<T> => {
  const headers = apiKey ? { Authorization: `Api-Key ${apiKey}` } : undefined
  const response = await axios.get(`${baseURL}/${addTrailingSlashToUrl(url)}`, { headers })
  return response.data
}
