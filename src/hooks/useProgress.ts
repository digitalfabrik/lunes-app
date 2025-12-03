import { Discipline } from '../constants/endpoints'
import { getProgress } from '../services/helpers'
import useStorage from './useStorage'

const useProgress = (profession: Discipline | null): number => {
  const [progress] = useStorage('progress')
  return getProgress(progress, profession)
}

export default useProgress
