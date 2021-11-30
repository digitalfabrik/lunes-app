import { DisciplineType, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { ReturnType } from './useLoadAsync'

export interface ServerResponse {
  id: number
  title: string
  description: string
  icon: string
  total_training_sets: number
  total_discipline_children: number
  total_documents: number
}

const getEndpoint = (parent: DisciplineType | null): string => {
  if (parent?.total_training_sets && parent.total_training_sets > 0) {
    return ENDPOINTS.trainingSet
  } else if (parent?.apiKey) {
    return ENDPOINTS.disciplinesByGroup
  } else {
    return ENDPOINTS.disciplines
  }
}

const formatServerResponse = (serverResponse: ServerResponse[], parent: DisciplineType | null): DisciplineType[] =>
  serverResponse.map(item => ({
    ...item,
    numberOfChildren: item.total_discipline_children || item.total_training_sets || item.total_documents,
    isLeaf: item.total_documents !== undefined,
    isRoot: parent === null,
    apiKey: parent?.apiKey
  })) ?? []

export const loadDisciplines = async (parent: DisciplineType | null): Promise<DisciplineType[]> => {
  const url = `${getEndpoint(parent)}/${parent?.id ?? ''}`
  const response = await getFromEndpoint<ServerResponse[]>(url, parent?.apiKey)
  return formatServerResponse(response, parent)
}

export const useLoadDisciplines = (parent: DisciplineType | null): ReturnType<DisciplineType[]> =>
  useLoadAsync(loadDisciplines, parent)
