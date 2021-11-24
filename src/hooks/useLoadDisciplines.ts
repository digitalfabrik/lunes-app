import { DisciplineType, ENDPOINTS } from '../constants/endpoints'
import { Discipline } from '../navigation/NavigationTypes'
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

const getEndpoint = (parent: Discipline | null): string => {
  if (parent?.isLeaf) {
    return ENDPOINTS.trainingSet
  } else if (parent?.apiKey) {
    return ENDPOINTS.disciplinesByGroup
  } else {
    return ENDPOINTS.disciplines
  }
}

const formatServerResponse = (serverResponse: ServerResponse[], apiKey?: string): DisciplineType[] =>
  serverResponse.map(item => ({
    ...item,
    numberOfChildren: item.total_discipline_children || item.total_training_sets || item.total_documents,
    isLeaf: item.total_discipline_children === 0,
    apiKey: apiKey
  })) ?? []

export const loadDisciplines = async (parent: Discipline | null): Promise<DisciplineType[]> => {
  const url = `${getEndpoint(parent)}/${parent?.id ?? ''}`
  const response = await getFromEndpoint<ServerResponse[]>(url, parent?.apiKey)
  return formatServerResponse(response, parent?.apiKey)
}

export const useLoadDisciplines = (parent: Discipline | null): ReturnType<DisciplineType[]> =>
  useLoadAsync(loadDisciplines, parent)
