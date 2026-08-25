import { renderHook } from '@testing-library/react-native'

import { StandardExerciseKeys } from '../../constants/data'
import { StandardUnitId } from '../../models/Unit'
import useStandardExerciseKey from '../useStandardExerciseKey'

const unitId: StandardUnitId = { type: 'standard', id: 42 }

describe('useStandardExerciseKey', () => {
  it('should build the standard exercise key payload', () => {
    const { result } = renderHook(() => useStandardExerciseKey(StandardExerciseKeys.wordChoiceExercise, unitId))

    expect(result.current).toEqual({ type: 'exercise', exercise_type: 'word_choice', unit_id: 42 })
  })

  it('should return null when there is no unit', () => {
    const { result } = renderHook(() => useStandardExerciseKey(StandardExerciseKeys.wordChoiceExercise, null))

    expect(result.current).toBeNull()
  })

  it('should keep the same reference across renders when the inputs do not change', () => {
    const { result, rerender } = renderHook(() =>
      useStandardExerciseKey(StandardExerciseKeys.wordChoiceExercise, { type: 'standard', id: 42 }),
    )
    const firstResult = result.current

    rerender({})

    expect(result.current).toBe(firstResult)
  })

  it('should rebuild the payload when the unit changes', () => {
    const { result, rerender } = renderHook(
      ({ unit }: { unit: StandardUnitId }) => useStandardExerciseKey(StandardExerciseKeys.wordChoiceExercise, unit),
      { initialProps: { unit: unitId } },
    )
    const firstResult = result.current

    rerender({ unit: { type: 'standard', id: 43 } })

    expect(result.current).not.toBe(firstResult)
    expect(result.current).toEqual({ type: 'exercise', exercise_type: 'word_choice', unit_id: 43 })
  })
})
