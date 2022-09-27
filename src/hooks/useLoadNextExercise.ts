import { NextExerciseData } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import { getNextExercise, loadTrainingsSet } from '../services/helpers'
import { formatDiscipline } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'
import { loadVocabularyItems } from './useLoadDocuments'

export const loadNextExercise = async (profession: Discipline): Promise<NextExerciseData> => {
  const nextExercise = await getNextExercise(profession)
  const trainingSet = await loadTrainingsSet(nextExercise.disciplineId)
  const vocabularyItems = await loadVocabularyItems({ disciplineId: nextExercise.disciplineId })
  return {
    vocabularyItems,
    title: formatDiscipline(trainingSet, { parent: null }).title,
    exerciseKey: nextExercise.exerciseKey,
    disciplineId: nextExercise.disciplineId,
  }
}

const useLoadNextExercise = (loadData: Discipline): Return<NextExerciseData> => useLoadAsync(loadNextExercise, loadData)

export default useLoadNextExercise
