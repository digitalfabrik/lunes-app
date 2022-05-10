import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { formatDiscipline } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'

export interface ServerResponse {
  id: number
  title: string
  description: string
  icon: string
  total_training_sets: number
  total_discipline_children: number
  total_documents: number
}

const getEndpoint = (parent: Discipline | null): string => {
  if (parent?.needsTrainingSetEndpoint) {
    return ENDPOINTS.trainingSet
  }
  if (parent?.apiKey && parent.parentTitle === null) {
    return ENDPOINTS.disciplinesByGroup
  }
  return ENDPOINTS.disciplines
}

const formatServerResponse = (serverResponse: ServerResponse[], parent: Discipline | null): Discipline[] =>
  serverResponse.map(item => formatDiscipline(item, parent))

export const loadDisciplines = async (parent: Discipline | null): Promise<Discipline[]> => {
  const url = `${getEndpoint(parent)}/${parent?.id ?? ''}`
  const response = await getFromEndpoint<ServerResponse[]>(url, parent?.apiKey)
  return formatServerResponse(response, parent)
}

export const useLoadDisciplines = (parent: Discipline | null): Return<Discipline[]> =>
  useLoadAsync(loadDisciplines, parent)
