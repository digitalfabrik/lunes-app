import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'
import { ServerResponse } from './useLoadDisciplines'

const formatServerResponse = (serverResponse: ServerResponse): Discipline => ({
  ...serverResponse,
  numberOfChildren:
    serverResponse.total_discipline_children || serverResponse.total_training_sets || serverResponse.total_documents,
  //  The ServerResponse type is not completely correct
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  isLeaf: serverResponse.total_documents !== undefined,
  parentTitle: null,
  needsTrainingSetEndpoint: !!serverResponse.total_training_sets && serverResponse.total_training_sets > 0
})

export const loadDiscipline = async (id: number): Promise<Discipline> => {
  const url = `${ENDPOINTS.discipline}/${id}`
  const response = await getFromEndpoint<ServerResponse>(url)
  return formatServerResponse(response)
}

export const useLoadDiscipline = (id: number): Return<Discipline> => useLoadAsync(loadDiscipline, id)
