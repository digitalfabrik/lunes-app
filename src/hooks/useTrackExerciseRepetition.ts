import { useEffect } from 'react'

import { ExerciseKey } from '../constants/data'
import { StandardUnitId } from '../models/Unit'
import { trackEvent } from '../services/AnalyticsService'
import { getCurrentSessionId } from '../services/SessionService'
import { useStorageCache } from './useStorage'

const useTrackExerciseRepetition = (exerciseType: ExerciseKey, unitId: StandardUnitId | null): void => {
  const storageCache = useStorageCache()

  useEffect(() => {
    if (unitId === null) {
      return
    }
    trackEvent(storageCache, {
      type: 'exercise_repetition',
      exercise_type: exerciseType,
      unit_id: unitId.id,
      session_id: getCurrentSessionId(),
    })
  }, [storageCache, exerciseType, unitId])
}

export default useTrackExerciseRepetition
