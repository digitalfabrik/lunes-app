import { useCallback } from 'react'

import { NextExerciseData, Progress } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import { getWordsByUnit } from '../services/CmsApi'
import { getNextExercise } from '../services/helpers'
import useLoadAsync, { Return } from './useLoadAsync'
import useStorage from './useStorage'

export const loadNextExercise = async (progress: Progress, job: Discipline): Promise<NextExerciseData> => {
  const { unit, exerciseKey } = await getNextExercise({ progress, job })
  const vocabularyItems = await getWordsByUnit(unit.id)
  return {
    vocabularyItems,
    jobTitle: job.title,
    exerciseKey,
    unit,
  }
}

const useLoadNextExercise = (profession: Discipline): Return<NextExerciseData> => {
  const [progress] = useStorage('progress')
  return useLoadAsync(
    useCallback(() => loadNextExercise(progress, profession), [progress, profession]),
    null,
  )
}

export default useLoadNextExercise
