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

export type DisciplineRequestData =
  | {
      apiKey: string
    }
  | {
      disciplineId: number
    }

export const loadDiscipline = async (params: DisciplineRequestData): Promise<Discipline> => {
  if (isTypeLoadProtected(params)) {
    const url = `${ENDPOINTS.groupInfo}`
    const response = await getFromEndpoint<ServerResponseGroup[]>(url, params.apiKey)
    return formatGroup(response, params.apiKey)
  }
  const url = `${ENDPOINTS.discipline}/${params.disciplineId}`
  const response = await getFromEndpoint<ServerResponseDiscipline>(url)
  return formatDiscipline(response, { parent: null })
}

export const useLoadDiscipline = (loadData: DisciplineRequestData): Return<Discipline> =>
  useLoadAsync(loadDiscipline, loadData)
