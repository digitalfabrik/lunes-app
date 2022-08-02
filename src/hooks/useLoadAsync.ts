import { useCallback, useEffect, useState } from 'react'

export const loadAsync = async <T, P>(
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
  } catch (e: any) {
    setError(e)
    setData(null)
  } finally {
    setLoading(false)
  }
}

export interface Return<T> {
  data: T | null
  error: Error | null
  loading: boolean
  refresh: () => void
}

export const useLoadAsync = <T, P>(request: (params: P) => Promise<T>, params: P): Return<T> => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const load = useCallback(() => {
    loadAsync<T, P>(request, params, setData, setError, setLoading).catch(e => setError(e))
    /* For small objects JSON.stringify is good enough. But does not work with ESLint rule */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, JSON.stringify(params)])

  useEffect(() => {
    load()
  }, [load])

  return { data, error, loading, refresh: load }
}

export default useLoadAsync
