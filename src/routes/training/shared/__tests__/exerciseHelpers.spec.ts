import { SIMPLE_RESULTS } from '../../../../constants/data'
import { getCheatResult, getNextExerciseIndex } from '../exerciseHelpers'

describe('getCheatResult', () => {
  it('returns the total number of items when cheating to succeed', () => {
    expect(getCheatResult(SIMPLE_RESULTS.correct, 5)).toBe(5)
  })

  it('returns zero when cheating to fail', () => {
    expect(getCheatResult(SIMPLE_RESULTS.incorrect, 5)).toBe(0)
  })
})

describe('getNextExerciseIndex', () => {
  it('advances to the next item when more items remain', () => {
    expect(getNextExerciseIndex(2, 5)).toEqual({
      nextIndex: 3,
      completed: false,
    })
  })

  it('marks the exercise as completed on the last item', () => {
    expect(getNextExerciseIndex(4, 5)).toEqual({
      nextIndex: 4,
      completed: true,
    })
  })
})
