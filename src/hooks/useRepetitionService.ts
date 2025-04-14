import { useCallback, useMemo } from 'react'

import { RepetitionService } from '../services/RepetitionService'
import useStorage from './useStorage'

const useRepetitionService = (): RepetitionService => {
  const [wordNodeCards, setWordNodeCards] = useStorage('wordNodeCards')
  const getWordNodeCards = useCallback(() => wordNodeCards, [wordNodeCards])
  return useMemo(() => new RepetitionService(getWordNodeCards, setWordNodeCards), [getWordNodeCards, setWordNodeCards])
}

export default useRepetitionService
