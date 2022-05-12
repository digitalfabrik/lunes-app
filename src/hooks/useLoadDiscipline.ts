import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { formatDiscipline, formatGroup, ServerResponseDiscipline, ServerResponseGroup } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'

type DisciplineLoadingData =
  | {
      apiKey: string
    }
  | {
      disciplineId: number
    }

export const isLoadByApiKeyType = (value: DisciplineLoadingData): value is { apiKey: string } =>
  Object.prototype.hasOwnProperty.call(value, 'apiKey')

export const loadDiscipline = async (loadData: DisciplineLoadingData): Promise<Discipline> => {
  if (isLoadByApiKeyType(loadData)) {
    const url = `${ENDPOINTS.groupInfo}`
    const response = await getFromEndpoint<ServerResponseGroup[]>(url, loadData.apiKey)
    return formatGroup(response, loadData.apiKey)
  }
  const url = `${ENDPOINTS.discipline}/${loadData.disciplineId}`
  const response = await getFromEndpoint<ServerResponseDiscipline>(url)
  return formatDiscipline(response, { parent: null })
}

export const useLoadDiscipline = (loadData: DisciplineLoadingData): Return<Discipline> =>
  useLoadAsync(loadDiscipline, loadData)
