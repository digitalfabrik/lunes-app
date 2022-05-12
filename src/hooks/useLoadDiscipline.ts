import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import {
  DisciplineRequestData,
  formatDiscipline,
  formatGroup,
  isTypeLoadProtected,
  ServerResponseDiscipline,
  ServerResponseGroup
} from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'

export const loadDiscipline = async (loadData: DisciplineRequestData): Promise<Discipline> => {
  if (isTypeLoadProtected(loadData)) {
    const url = `${ENDPOINTS.groupInfo}`
    const response = await getFromEndpoint<ServerResponseGroup[]>(url, loadData.apiKey)
    return formatGroup(response, loadData.apiKey)
  }
  const url = `${ENDPOINTS.discipline}/${loadData.disciplineId}`
  const response = await getFromEndpoint<ServerResponseDiscipline>(url)
  return formatDiscipline(response, { parent: null })
}

export const useLoadDiscipline = (loadData: DisciplineRequestData): Return<Discipline> =>
  useLoadAsync(loadDiscipline, loadData)
