import { ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { ServerResponseDiscipline } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'

export const loadAllDisciplines = async (): Promise<ServerResponseDiscipline[]> => {
  const endpoint = `${ENDPOINTS.discipline}/`
  return await getFromEndpoint<ServerResponseDiscipline[]>(endpoint)
}

export const useLoadAllDisciplines = (): Return<ServerResponseDiscipline[]> => useLoadAsync(loadAllDisciplines, {})
