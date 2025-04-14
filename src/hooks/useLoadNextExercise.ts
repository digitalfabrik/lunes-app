import { useCallback } from 'react'

import { NextExerciseData, Progress } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import { getNextExercise, loadTrainingsSet } from '../services/helpers'
import { formatDiscipline } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'
import { loadVocabularyItems } from './useLoadVocabularyItems'
import useStorage from './useStorage'

export const loadNextExercise = async (progress: Progress, profession: Discipline): Promise<NextExerciseData> => {
  const nextExercise = await getNextExercise(progress, profession)
  const trainingSet = await loadTrainingsSet(nextExercise.disciplineId)
  const vocabularyItems = await loadVocabularyItems({ disciplineId: nextExercise.disciplineId })
  return {
    vocabularyItems,
    title: formatDiscipline(trainingSet, { parent: null }).title,
    exerciseKey: nextExercise.exerciseKey,
    disciplineId: nextExercise.disciplineId,
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
