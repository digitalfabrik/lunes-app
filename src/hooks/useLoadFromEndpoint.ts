import { useCallback, useEffect, useState } from 'react'

import axios from '../services/axios'

export const loadFromEndpoint = async <T>(
  url: string,
  setData: (data: T | null) => void,
  setError: (error: Error | null) => void,
  setLoading: (loading: boolean) => void,
  apiKey?: string
): Promise<void> => {
  setLoading(true)

  const header = apiKey ? { Authorization: `Api-Key ${apiKey}` } : {}

  try {
    const response = await axios.get(url, { headers: header })
    setData(response.data)
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

export const useLoadFromEndpoint = <T>(url: string, apiKey?: string): ReturnType<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const load = useCallback(() => {
    loadFromEndpoint<T>(url, setData, setError, setLoading, apiKey).catch(e => setError(e))
  }, [url, apiKey])

  useEffect(() => {
    load()
  }, [load])

  return { data, error, loading, refresh: load }
}

export default useLoadFromEndpoint
