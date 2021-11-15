import { useCallback, useEffect, useState } from 'react'

import AsyncStorage from '../services/AsyncStorage'

export const loadFromAsyncStorage = async (
  setData: (data: string[] | null) => void,
  setError: (error: Error | null) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true)

  try {
    const response = await AsyncStorage.getCustomDisciplines()
    setData(response)
    setError(null)
  } catch (e) {
    setError(e)
    setData(null)
  } finally {
    setLoading(false)
  }
}

export interface ReturnType {
  data: string[] | null
  error: Error | null
  loading: boolean
  refresh: () => void
}

export const useReadFromAsyncStorage = (): ReturnType => {
  const [data, setData] = useState<string[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const load = useCallback(() => {
    loadFromAsyncStorage(setData, setError, setLoading).catch(e => setError(e))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { data, error, loading, refresh: load }
}

export default useReadFromAsyncStorage
