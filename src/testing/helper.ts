import { Return } from '../hooks/useLoadAsync'

export const getReturnOf = <T>(data: T): Return<T> => ({
  data,
  error: null,
  loading: false,
  refresh: () => undefined
})
