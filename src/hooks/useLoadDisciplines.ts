import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { formatDiscipline, isTypeLoadProtected, ServerResponseDiscipline } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'

export type DisciplinesRequestData =
  | {
      apiKey: string
    }
  | {
      parent: Discipline | null
    }

const getEndpoint = (params: DisciplinesRequestData): string => {
  if (isTypeLoadProtected(params)) {
    return ENDPOINTS.groupInfo
  }
  if (params.parent?.needsTrainingSetEndpoint) {
    return `${ENDPOINTS.trainingSet}/${params.parent.id}`
  }
  if (params.parent?.apiKey && params.parent.parentTitle === null) {
    return `${ENDPOINTS.disciplinesByGroup}/${params.parent.id}`
  }
  return `${ENDPOINTS.disciplines}/${params.parent?.id ?? ''}`
}

export const loadDisciplines = async (loadingInfo: DisciplinesRequestData): Promise<Discipline[]> => {
  const url = getEndpoint(loadingInfo)
  const apiKey = isTypeLoadProtected(loadingInfo) ? loadingInfo.apiKey : loadingInfo.parent?.apiKey
  const response = await getFromEndpoint<ServerResponseDiscipline[]>(url, apiKey)
  return response.map(item => formatDiscipline(item, loadingInfo))
}

export const useLoadDisciplines = (loadingInfo: DisciplinesRequestData): Return<Discipline[]> =>
  useLoadAsync(loadDisciplines, loadingInfo)
