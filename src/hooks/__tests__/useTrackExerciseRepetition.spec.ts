import { renderHook } from '@testing-library/react-native'

import { StandardExerciseKeyPayload } from '../../constants/data'
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

const exerciseKey: StandardExerciseKeyPayload = { type: 'exercise', exercise_type: 'word_choice', unit_id: 42 }

describe('useTrackExerciseRepetition', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should track exercise_repetition event on mount', () => {
    renderHook(() => useTrackExerciseRepetition(exerciseKey))

    expect(trackEvent).toHaveBeenCalledWith('mockStorageCache', {
      type: 'exercise_repetition',
      exercise_key: exerciseKey,
      session_id: 'test-session-id',
    })
    expect(trackEvent).toHaveBeenCalledTimes(1)
  })

  it('should count each exercise screen entry once', () => {
    const { rerender } = renderHook(() => useTrackExerciseRepetition(exerciseKey))
    rerender({})

    expect(trackEvent).toHaveBeenCalledTimes(1)
  })

  it('should not track an event without an exercise key', () => {
    renderHook(() => useTrackExerciseRepetition(null))

    expect(trackEvent).not.toHaveBeenCalled()
  })
})
