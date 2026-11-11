import { SIMPLE_RESULTS, SimpleResult } from '../../../constants/data'

export const getCheatResult = (result: SimpleResult, totalItems: number): number =>
  result === SIMPLE_RESULTS.correct ? totalItems : 0

export const getNextExerciseIndex = (
  currentIndex: number,
  totalItems: number,
): { nextIndex: number; completed: boolean } => {
  const completed = currentIndex + 1 >= totalItems

  return {
    nextIndex: completed ? currentIndex : currentIndex + 1,
    completed,
  }
}
