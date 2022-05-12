import { Discipline, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { formatDiscipline, isTypeLoadGroupType, DisciplinesLoadingInfo, ServerResponseDiscipline } from './helpers'
import useLoadAsync, { Return } from './useLoadAsync'

const getEndpoint = (loadingInfo: DisciplinesLoadingInfo): string => {
  if (isTypeLoadGroupType(loadingInfo)) {
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
  loadingInfo: DisciplinesLoadingInfo
): Discipline[] => serverResponse.map(item => formatDiscipline(item, loadingInfo))

export const loadDisciplines = async (loadingInfo: DisciplinesLoadingInfo): Promise<Discipline[]> => {
  const url = getEndpoint(loadingInfo)
  const apiKey = isTypeLoadGroupType(loadingInfo) ? loadingInfo.apiKey : loadingInfo.parent?.apiKey
  const response = await getFromEndpoint<ServerResponseDiscipline[]>(url, apiKey)
  return formatServerResponse(response, loadingInfo)
}

export const useLoadDisciplines = (loadingInfo: DisciplinesLoadingInfo): Return<Discipline[]> =>
  useLoadAsync(loadDisciplines, loadingInfo)
