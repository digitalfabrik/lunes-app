import axios from 'axios'

import { addTrailingSlashToUrl } from './helpers'

const baseURL = __DEV__ ? 'https://lunes-test.tuerantuer.org/api' : 'https://lunes.tuerantuer.org/api'

export const getFromEndpoint = async <T>(url: string, apiKey?: string): Promise<T> => {
  const headers = apiKey ? { Authorization: `Api-Key ${apiKey}` } : undefined
  const response = await axios.get(`${baseURL}/${addTrailingSlashToUrl(url)}`, { headers })
  return response.data
}
