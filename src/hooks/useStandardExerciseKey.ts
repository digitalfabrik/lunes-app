import { useRef } from 'react'

import { StandardExerciseKey, StandardExerciseKeyPayload } from '../constants/data'
import { StandardUnitId } from '../models/Unit'

// Keeps a stable reference across renders so the tracking hooks' effects don't re-fire on every render.
const useStandardExerciseKey = (
  exerciseType: StandardExerciseKey,
  unitId: StandardUnitId | null,
): StandardExerciseKeyPayload | null => {
  const exerciseKeyRef = useRef<StandardExerciseKeyPayload | null>(null)
  if (unitId === null) {
    exerciseKeyRef.current = null
  } else if (exerciseKeyRef.current?.unit_id !== unitId.id || exerciseKeyRef.current.exercise_type !== exerciseType) {
    exerciseKeyRef.current = { type: 'exercise', exercise_type: exerciseType, unit_id: unitId.id }
  }
  return exerciseKeyRef.current
}

export default useStandardExerciseKey
