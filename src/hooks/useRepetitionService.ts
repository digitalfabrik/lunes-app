import { useMemo } from 'react'

import { RepetitionService } from '../services/RepetitionService'
import { useWordNodeCards } from '../services/SyncStorage'

export const useRepetitionService = (): RepetitionService => {
  const [wordNodeCards, setWordNodeCards] = useWordNodeCards()
  return useMemo(() => new RepetitionService(wordNodeCards, setWordNodeCards), [setWordNodeCards, wordNodeCards])
}

export const useNumberOfWordsNeedingRepetitionWithUpperBound = (): number => {
  const repetitionService = useRepetitionService()
  return useMemo(() => repetitionService.getNumberOfWordsNeedingRepetitionWithUpperBound(), [repetitionService])
}
