import axios, { AxiosResponse } from 'axios'
import { buildKeyGenerator, setupCache } from 'axios-cache-interceptor'

import { getStorageItem } from './Storage'

// The emulator treats this special ip as the localhost of the host
export const localhostCMS = 'http://10.0.2.2:8080/api/v2'
export const testCMS = 'https://lunes-test.tuerantuer.org/api/v2'
export const productionCMS = 'https://lunes.tuerantuer.org/api/v2'
export const CMS_URLS = [localhostCMS, testCMS, productionCMS] as const
export type CMS = (typeof CMS_URLS)[number]

export const getBaseURL = (overwriteCMS: CMS | null): CMS => {
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
  const baseURL = getBaseURL(await getStorageItem('cmsUrlOverwrite'))
  return `${baseURL}/${endpoint}`
}

export const getFromEndpoint = async <T>(endpoint: string): Promise<T> => {
  const response = await axios.get(await getUrl(endpoint))
  return response.data
}

export const postToEndpoint = async <T>(endpoint: string, data: T): Promise<AxiosResponse> =>
  axios.post(await getUrl(endpoint), data)
