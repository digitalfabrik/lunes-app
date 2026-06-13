import { renderHook } from '@testing-library/react-native'

import { TrainingExerciseKeys } from '../../constants/data'
import useTrainingExerciseKey from '../useTrainingExerciseKey'

describe('useTrainingExerciseKey', () => {
  it('should build the training exercise key payload', () => {
    const { result } = renderHook(() => useTrainingExerciseKey(TrainingExerciseKeys.image, 7))

    expect(result.current).toEqual({ type: 'training', exercise_type: 'image', job_id: 7 })
  })

  it('should keep the same reference across renders when the inputs do not change', () => {
    const { result, rerender } = renderHook(() => useTrainingExerciseKey(TrainingExerciseKeys.image, 7))
    const firstResult = result.current

    rerender({})

    expect(result.current).toBe(firstResult)
  })

  it('should rebuild the payload when the job changes', () => {
    const { result, rerender } = renderHook(
      ({ jobId }: { jobId: number }) => useTrainingExerciseKey(TrainingExerciseKeys.image, jobId),
      { initialProps: { jobId: 7 } },
    )
    const firstResult = result.current

    rerender({ jobId: 8 })

    expect(result.current).not.toBe(firstResult)
    expect(result.current).toEqual({ type: 'training', exercise_type: 'image', job_id: 8 })
  })
})
