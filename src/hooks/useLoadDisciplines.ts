import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { formatDiscipline, isTypeLoadProtected, ServerResponseDiscipline } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'

export type RequestParams =
  | {
      apiKey: string
    }
  | {
      parent?: Discipline | null
      onlyChildren?: boolean
    }

const getEndpoint = (params: RequestParams): string => {
  if (isTypeLoadProtected(params)) {
    return ENDPOINTS.groupInfo
  }
  if (params.onlyChildren) {
    return `${ENDPOINTS.discipline}/`
  }
  if (params.parent?.needsTrainingSetEndpoint) {
    return `${ENDPOINTS.trainingSet}/${params.parent.id}`
  }
  if (params.parent?.apiKey && params.parent.parentTitle === null) {
    return `${ENDPOINTS.disciplinesByGroup}/${params.parent.id}`
  }
  return `${ENDPOINTS.disciplines}/${params.parent?.id ?? ''}`
}

export const loadDisciplines = async (loadingInfo: RequestParams): Promise<Discipline[]> => {
  const url = getEndpoint(loadingInfo)
  const apiKey = isTypeLoadProtected(loadingInfo) ? loadingInfo.apiKey : loadingInfo.parent?.apiKey
  const response = await getFromEndpoint<ServerResponseDiscipline[]>(url, apiKey)
  if (!isTypeLoadProtected(loadingInfo) && loadingInfo.onlyChildren) {
    return response
      .filter(discipline => discipline.total_discipline_children === 0)
      .map(discipline => formatDiscipline(discipline, loadingInfo))
  }
  return response.map(discipline => formatDiscipline(discipline, loadingInfo))
}

export const useLoadDisciplines = (loadingInfo: RequestParams): Return<Discipline[]> =>
  useLoadAsync(loadDisciplines, loadingInfo)
