import { useMemo } from 'react'

import { Discipline } from '../constants/endpoints'
import { getProgress } from '../services/helpers'
import useStorage from './useStorage'

const useReadFromAsyncStorage = (profession: Discipline | null): number => {
  const [progress] = useStorage('progress')
  return useMemo(() => getProgress(progress, profession), [progress, profession])
}

export default useReadFromAsyncStorage
