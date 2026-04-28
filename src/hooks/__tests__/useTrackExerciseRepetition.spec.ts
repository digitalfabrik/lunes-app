import { renderHook } from '@testing-library/react-native'

import { ExerciseKeys } from '../../constants/data'
import { StandardUnitId } from '../../models/Unit'
import { trackEvent } from '../../services/AnalyticsService'
import useTrackExerciseRepetition from '../useTrackExerciseRepetition'

jest.mock('../../services/AnalyticsService', () => ({
  trackEvent: jest.fn(),
}))

jest.mock('../../services/SessionService', () => ({
  getCurrentSessionId: jest.fn(() => 'test-session-id'),
}))

jest.mock('../useStorage', () => ({
  useStorageCache: jest.fn(() => 'mockStorageCache'),
}))

const unitId: StandardUnitId = { type: 'standard', id: 42 }

describe('useTrackExerciseRepetition', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should track exercise_repetition event on mount', () => {
    renderHook(() => useTrackExerciseRepetition(ExerciseKeys.wordChoiceExercise, unitId))

    expect(trackEvent).toHaveBeenCalledWith('mockStorageCache', {
      type: 'exercise_repetition',
      exercise_type: ExerciseKeys.wordChoiceExercise,
      unit_id: 42,
      session_id: 'test-session-id',
    })
    expect(trackEvent).toHaveBeenCalledTimes(1)
  })

  it('should count each exercise screen entry once', () => {
    const { rerender } = renderHook(() => useTrackExerciseRepetition(ExerciseKeys.wordChoiceExercise, unitId))
    rerender({})

    expect(trackEvent).toHaveBeenCalledTimes(1)
  })

  it('should not track an event without a unit id', () => {
    renderHook(() => useTrackExerciseRepetition(ExerciseKeys.wordChoiceExercise, null))

    expect(trackEvent).not.toHaveBeenCalled()
  })
})
