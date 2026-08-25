import { useEffect } from 'react'

import { ExerciseKeyPayload } from '../constants/data'
import { trackEvent } from '../services/AnalyticsService'
import { getCurrentSessionId } from '../services/SessionService'
import { useStorageCache } from './useStorage'

const useTrackExerciseRepetition = (exerciseKey: ExerciseKeyPayload | null): void => {
  const storageCache = useStorageCache()

  useEffect(() => {
    if (exerciseKey === null) {
      return
    }
    trackEvent(storageCache, {
      type: 'exercise_repetition',
      exercise_key: exerciseKey,
      session_id: getCurrentSessionId(),
    })
  }, [storageCache, exerciseKey])
}

export default useTrackExerciseRepetition
