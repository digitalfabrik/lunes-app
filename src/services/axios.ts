import axios, { AxiosResponse } from 'axios'
import { buildKeyGenerator, setupCache } from 'axios-cache-interceptor'

import { getOverwriteCMS } from './AsyncStorage'
import { addTrailingSlashToUrl } from './url'

export const testCMS = 'https://lunes-test.tuerantuer.org/api'
export const productionCMS = 'https://lunes.tuerantuer.org/api'
export type CMS = typeof testCMS | typeof productionCMS

export const getBaseURL = async (): Promise<CMS> => {
  const overwriteCMS = await getOverwriteCMS()
  if (overwriteCMS) {
    return overwriteCMS
  }
  return __DEV__ ? testCMS : productionCMS
}

const keyGenerator = buildKeyGenerator(({ headers, baseURL = '', url = '', method = 'get', params, data }) => ({
  url: baseURL + (baseURL && url ? '/' : '') + url,
  headers: headers?.Authorization ?? 'not-set',
  method,
  params: params as unknown,
  data,
}))

setupCache(axios, {
  generateKey: keyGenerator,
})

const getUrl = async (endpoint: string): Promise<string> => {
  const baseURL = await getBaseURL()
  return `${baseURL}/${addTrailingSlashToUrl(endpoint)}`
}

export const getFromEndpoint = async <T>(endpoint: string, apiKey?: string): Promise<T> => {
  const headers = apiKey ? { Authorization: `Api-Key ${apiKey}` } : undefined
  const response = await axios.get(await getUrl(endpoint), { headers })
  return response.data
}

export const postToEndpoint = async <T>(endpoint: string, data: T, apiKey?: string): Promise<AxiosResponse> => {
  const headers = apiKey ? { Authorization: `Api-Key ${apiKey}` } : undefined
  return axios.post(await getUrl(endpoint), data, { headers })
}
