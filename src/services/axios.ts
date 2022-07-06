import axios from 'axios'
import { buildKeyGenerator, setupCache } from 'axios-cache-interceptor'

import AsyncStorage from './AsyncStorage'
import { addTrailingSlashToUrl } from './url'

export const testCMS = 'https://lunes-test.tuerantuer.org/api'
export const productionCMS = 'https://lunes.tuerantuer.org/api'
export type CMS = typeof testCMS | typeof productionCMS

export const getBaseURL = async (): Promise<CMS> => {
  const overwriteCMS = await AsyncStorage.getOverwriteCMS()
  if (overwriteCMS) {
    return overwriteCMS
  }
  return __DEV__ ? testCMS : productionCMS
}

const keyGenerator = buildKeyGenerator(true, ({ headers, baseURL = '', url = '', method = 'get', params, data }) => ({
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
  const baseURL = await getBaseURL()
  const headers = apiKey ? { Authorization: `Api-Key ${apiKey}` } : undefined
  const response = await axios.get(`${baseURL}/${addTrailingSlashToUrl(url)}`, { headers })
  return response.data
}
