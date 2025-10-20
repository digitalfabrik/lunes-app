import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { JobId } from '../services/CmsApi'
import { getFromEndpoint } from '../services/axios'
import {
  formatDiscipline,
  formatGroup,
  isTypeLoadProtected,
  ServerResponseDiscipline,
  ServerResponseGroup,
} from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'

export const loadDiscipline = async (params: JobId): Promise<Discipline> => {
  if (isTypeLoadProtected(params)) {
    const url = `${ENDPOINTS.groupInfo}`
    const response = await getFromEndpoint<ServerResponseGroup[]>(url, params.apiKey)
    return formatGroup(response, params.apiKey)
  }
  const url = `${ENDPOINTS.discipline}/${params.disciplineId}`
  const response = await getFromEndpoint<ServerResponseDiscipline>(url)
  return formatDiscipline(response, { parent: null })
}

export const useLoadDiscipline = (loadData: JobId): Return<Discipline> => useLoadAsync(loadDiscipline, loadData)
