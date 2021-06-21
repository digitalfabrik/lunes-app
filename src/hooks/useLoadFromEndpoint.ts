import { useCallback, useEffect, useState } from 'react'
import axios from '../utils/axios'

export const loadFromEndpoint = async <T>(
  url: string,
  setData: (data: T | null) => void,
  setError: (error: Error | null) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true)

  try {
    const response = await axios.get(url)

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

export const useLoadFromEndpoint = <T>(url: string): ReturnType<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const load = useCallback(() => {
    loadFromEndpoint<T>(url, setData, setError, setLoading).catch(e => setError(e))
  }, [url])

  useEffect(() => {
    load()
  }, [load])

  return { data, error, loading, refresh: load }
}

export default useLoadFromEndpoint
