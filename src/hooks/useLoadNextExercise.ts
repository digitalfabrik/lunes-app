import { Discipline, Document, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { getNextExercise } from '../services/helpers'
import { formatDiscipline, ServerResponseDiscipline } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'
import { DocumentFromServer, formatServerResponse } from './useLoadDocuments'

export interface NextExerciseData {
  documents: Document[]
  title: string
  exerciseKey: number
  disciplineId: number
}

export const loadNextExercise = async (profession: Discipline): Promise<NextExerciseData> => {
  const nextExercise = await getNextExercise(profession)
  const trainingSetUrl = `${ENDPOINTS.trainingSets}/${nextExercise.disciplineId}`
  const trainingSet = await getFromEndpoint<ServerResponseDiscipline>(trainingSetUrl)
  const documentUrl = ENDPOINTS.documents.replace(':id', `${nextExercise.disciplineId}`)
  const documents = await getFromEndpoint<DocumentFromServer[]>(documentUrl)
  return {
    documents: formatServerResponse(documents),
    title: formatDiscipline(trainingSet, { parent: null }).title,
    exerciseKey: nextExercise.exerciseKey,
    disciplineId: nextExercise.disciplineId
  }
}

const useLoadNextExercise = (loadData: Discipline): Return<NextExerciseData> =>
  useLoadAsync(loadNextExercise, loadData)

export default useLoadNextExercise
