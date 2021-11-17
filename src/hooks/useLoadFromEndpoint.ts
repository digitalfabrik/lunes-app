import { useCallback, useEffect, useState } from 'react'

import axios from '../services/axios'

export const getFromEndpoint = async <T>(url: string, apiKey?: string): Promise<T> => {
  const headers = apiKey ? { Authorization: `Api-Key ${apiKey}` } : undefined
  const response = await axios.get(url, { headers })
  return response.data
}

export const loadFromEndpoint = async <T, P>(
  request: (params: P) => Promise<T>,
  params: P,
  setData: (data: T | null) => void,
  setError: (error: Error | null) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true)

  try {
    const response = await request(params)
    setData(response)
    setError(null)
  } catch (e) {
    setError(e)
    setData(null)
  } finally {
    setLoading(false)
  }
}

export interface ReturnType<T> {
  data: T | null
  error: Error | null
  loading: boolean
  refresh: () => void
}

export const useLoadFromEndpoint = <T, P>(request: (params: P) => Promise<T>, params: P): ReturnType<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const load = useCallback(() => {
    loadFromEndpoint<T, P>(request, params, setData, setError, setLoading).catch(e => setError(e))
  }, [request, params])

  useEffect(() => {
    load()
  }, [load])

  return { data, error, loading, refresh: load }
}

export default useLoadFromEndpoint
