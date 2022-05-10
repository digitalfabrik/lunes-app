import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { formatDiscipline } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'
import { ServerResponse } from './useLoadDisciplines'

export const loadDiscipline = async (id: number): Promise<Discipline> => {
  const url = `${ENDPOINTS.discipline}/${id}`
  const response = await getFromEndpoint<ServerResponse>(url)
  return formatDiscipline(response)
}

export const useLoadDiscipline = (id: number): Return<Discipline> => useLoadAsync(loadDiscipline, id)
