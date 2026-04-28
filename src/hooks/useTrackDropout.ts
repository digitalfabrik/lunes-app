import { StackNavigationProp } from '@react-navigation/stack'
import { useEffect, useRef } from 'react'

import { StandardUnitId } from '../models/Unit'
import { RoutesParams } from '../navigation/NavigationTypes'
import { trackEvent } from '../services/AnalyticsService'
import { useStorageCache } from './useStorage'

const useTrackDropout = (
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise'>,
  unitId: StandardUnitId | null,
  currentWord: number,
  totalWords: number,
): { markCompleted: () => void } => {
  const storageCache = useStorageCache()
  const isCompletedRef = useRef(false)

  const markCompleted = (): void => {
    isCompletedRef.current = true
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (isCompletedRef.current) {
        return
      }
      trackEvent(storageCache, {
        type: 'exercise_dropout',
        exercise_type: 'word_choice',
        unit_id: unitId?.id ?? null,
        position: currentWord + 1,
        total: totalWords,
      })
    })
    return unsubscribe
  }, [navigation, storageCache, unitId, currentWord, totalWords])

  return { markCompleted }
}

export default useTrackDropout
