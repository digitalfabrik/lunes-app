import axios from 'axios'

const baseURL = __DEV__ ? 'https://lunes-test.tuerantuer.org/api' : 'https://lunes.tuerantuer.org/api'

export const getFromEndpoint = async <T>(url: string, apiKey?: string): Promise<T> => {
  const headers = apiKey ? { Authorization: `Api-Key ${apiKey}` } : undefined
  const response = await axios.get(`${baseURL}/${url}`, { headers })
  return response.data
}
