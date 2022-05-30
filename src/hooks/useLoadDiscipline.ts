import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import {
  formatDiscipline,
  formatGroup,
  isTypeLoadProtected,
  ServerResponseDiscipline,
  ServerResponseGroup
} from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'

export type RequestParams =
  | {
      apiKey: string
    }
  | {
      disciplineId: number
      needsTrainingSetEndpoint?: boolean
    }

export const loadDiscipline = async (params: RequestParams): Promise<Discipline> => {
  let url
  if (isTypeLoadProtected(params)) {
    url = `${ENDPOINTS.groupInfo}`
    const response = await getFromEndpoint<ServerResponseGroup[]>(url, params.apiKey)
    return formatGroup(response, params.apiKey)
  }
  if (params.needsTrainingSetEndpoint) {
    url = `${ENDPOINTS.trainingSets}/${params.disciplineId}`
  } else {
    url = `${ENDPOINTS.discipline}/${params.disciplineId}`
  }
  const response = await getFromEndpoint<ServerResponseDiscipline>(url)
  return formatDiscipline(response, { parent: null })
}

export const useLoadDiscipline = (loadData: RequestParams): Return<Discipline> => useLoadAsync(loadDiscipline, loadData)
