import axios from 'axios'

import { addTrailingSlashToUrl } from './helpers'

const baseURL = __DEV__ ? 'https://lunes-test.tuerantuer.org/api' : 'https://lunes.tuerantuer.org/api'

export const getFromEndpoint = async <T>(url: string, apiKey?: string): Promise<T> => {
  const headers = apiKey ? { Authorization: `Api-Key ${apiKey}` } : {}
  const response = await axios.get(`${baseURL}/${addTrailingSlashToUrl(url)}`, { headers })
  return response.data
}

/*
import axios from 'axios'

const baseURL = __DEV__ ? 'https://lunes-test.tuerantuer.org/api' : 'https://lunes.tuerantuer.org/api'

interface Header {
  Authorization?: string
  baseURL?: string
}

export const getFromEndpoint = async <T>(url: string, apiKey?: string): Promise<T> => {
  const headers: Header = apiKey ? { Authorization: `Api-Key ${apiKey}` } : {}
  headers.baseURL = baseURL
  const response = await axios.get(url, { headers })
  return response.data
}

 */
