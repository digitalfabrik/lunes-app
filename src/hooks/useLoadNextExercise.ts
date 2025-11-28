import { useCallback } from 'react'

import { NextExerciseData, Progress } from '../constants/data'
import Job from '../models/Job'
import { getWordsByUnit } from '../services/CmsApi'
import { getNextExercise } from '../services/helpers'
import useLoadAsync, { Return } from './useLoadAsync'
import useStorage from './useStorage'

export const loadNextExercise = async (progress: Progress, job: Job): Promise<NextExerciseData> => {
  const { unit, exerciseKey } = await getNextExercise({ progress, job })
  const vocabularyItems = await getWordsByUnit(unit.id)
  return {
    vocabularyItems,
    jobTitle: job.name,
    exerciseKey,
    unit,
  }
}

const useLoadNextExercise = (job: Job): Return<NextExerciseData> => {
  const [progress] = useStorage('progress')
  return useLoadAsync(
    useCallback(() => loadNextExercise(progress, job), [progress, job]),
    null,
  )
}

export default useLoadNextExercise
