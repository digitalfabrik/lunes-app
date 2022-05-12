import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { formatDiscipline, isTypeLoadProtected, DisciplinesRequestData, ServerResponseDiscipline } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'

const getEndpoint = (loadingInfo: DisciplinesRequestData): string => {
  if (isTypeLoadProtected(loadingInfo)) {
    return ENDPOINTS.groupInfo
  }
  if (loadingInfo.parent?.needsTrainingSetEndpoint) {
    return `${ENDPOINTS.trainingSet}/${loadingInfo.parent.id}`
  }
  if (loadingInfo.parent?.apiKey && loadingInfo.parent.parentTitle === null) {
    return `${ENDPOINTS.disciplinesByGroup}/${loadingInfo.parent.id}`
  }
  return `${ENDPOINTS.disciplines}/${loadingInfo.parent?.id ?? ''}`
}

const formatServerResponse = (
  serverResponse: ServerResponseDiscipline[],
  loadingInfo: DisciplinesRequestData
): Discipline[] => serverResponse.map(item => formatDiscipline(item, loadingInfo))

export const loadDisciplines = async (loadingInfo: DisciplinesRequestData): Promise<Discipline[]> => {
  const url = getEndpoint(loadingInfo)
  const apiKey = isTypeLoadProtected(loadingInfo) ? loadingInfo.apiKey : loadingInfo.parent?.apiKey
  const response = await getFromEndpoint<ServerResponseDiscipline[]>(url, apiKey)
  return formatServerResponse(response, loadingInfo)
}

export const useLoadDisciplines = (loadingInfo: DisciplinesRequestData): Return<Discipline[]> =>
  useLoadAsync(loadDisciplines, loadingInfo)
