import { DisciplineType, ENDPOINTS } from '../constants/endpoints'
import { Discipline } from '../navigation/NavigationTypes'
import useLoadFromEndpoint, { ReturnType } from './useLoadFromEndpoint'

export interface ServerResponse {
  id: number
  title: string
  description: string
  icon: string
  total_training_sets: number
  total_discipline_children: number
  total_documents: number
}

const formatServerResponse = (
  serverResponse: ReturnType<ServerResponse[]>,
  apiKey?: string
): ReturnType<DisciplineType[]> => {
  const formattedServerResponse: DisciplineType[] =
    serverResponse.data?.map(item => ({
      ...item,
      numberOfChildren: item.total_discipline_children || item.total_training_sets || item.total_documents,
      isLeaf: item.total_discipline_children === 0,
      apiKey: apiKey
    })) ?? []
  return { ...serverResponse, data: formattedServerResponse }
}

export const useLoadDisciplines = (parent: Discipline | null): ReturnType<DisciplineType[]> => {
  let prefix
  if (parent?.isLeaf) {
    prefix = ENDPOINTS.trainingSet
  } else {
    prefix = parent?.apiKey ? ENDPOINTS.disciplinesByGroup : ENDPOINTS.disciplines
  }
  const suffix = parent?.id ?? ''
  const disciplines = useLoadFromEndpoint<ServerResponse[]>(`${prefix}/${suffix}`, parent?.apiKey)

  return formatServerResponse(disciplines, parent?.apiKey)
}
