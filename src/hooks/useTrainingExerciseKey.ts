import { useRef } from 'react'

import { TrainingExerciseKey, TrainingExerciseKeyPayload } from '../constants/data'

// Keeps a stable reference across renders so the tracking hooks' effects don't re-fire on every render.
const useTrainingExerciseKey = (exerciseType: TrainingExerciseKey, jobId: number): TrainingExerciseKeyPayload => {
  const exerciseKeyRef = useRef<TrainingExerciseKeyPayload | null>(null)
  if (exerciseKeyRef.current?.job_id !== jobId || exerciseKeyRef.current.exercise_type !== exerciseType) {
    exerciseKeyRef.current = { type: 'training', exercise_type: exerciseType, job_id: jobId }
  }
  return exerciseKeyRef.current
}

export default useTrainingExerciseKey
