import { StackNavigationProp } from '@react-navigation/stack'
import { useEffect, useRef } from 'react'

import { ExerciseKeyPayload } from '../constants/data'
import { Route, RoutesParams } from '../navigation/NavigationTypes'
import { trackEvent } from '../services/AnalyticsService'
import { useStorageCache } from './useStorage'

const useTrackDropout = (
  navigation: StackNavigationProp<RoutesParams, Route>,
  exerciseKey: ExerciseKeyPayload | null,
  currentIndex: number,
  totalWords: number,
  vocabularyItemId?: number,
): { markCompleted: () => void } => {
  const storageCache = useStorageCache()
  const isCompletedRef = useRef(false)

  const markCompleted = (): void => {
    isCompletedRef.current = true
  }

  useEffect(() => {
    if (exerciseKey === null) {
      return undefined
    }
    return navigation.addListener('beforeRemove', () => {
      if (isCompletedRef.current) {
        return
      }
      trackEvent(storageCache, {
        type: 'exercise_dropout',
        exercise_key: exerciseKey,
        position: currentIndex + 1,
        total: totalWords,
        vocabulary_item_id: vocabularyItemId ?? null,
      })
    })
  }, [navigation, storageCache, exerciseKey, currentIndex, totalWords, vocabularyItemId])

  return { markCompleted }
}

export default useTrackDropout
