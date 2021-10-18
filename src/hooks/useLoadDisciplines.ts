import { DisciplineType, ENDPOINTS } from '../constants/endpoints'
import useLoadFromEndpoint, { ReturnType } from './useLoadFromEndpoint'

interface ServerResponse {
  id: number
  title: string
  description: string
  icon: string
  total_training_sets: number
  total_discipline_children: number
  total_documents: number
}

const formatServerResponse = (serverResponse: ReturnType<ServerResponse[]>): ReturnType<DisciplineType[]> => {
  const formattedServerResponse: DisciplineType[] =
    serverResponse.data?.map(item => ({
      ...item,
      numberOfChildren: item.total_discipline_children || item.total_training_sets || item.total_documents,
      isLeaf: item.total_discipline_children === 0
    })) ?? []
  return { ...serverResponse, data: formattedServerResponse }
}

export const useLoadDisciplines = (
  parent: DisciplineType | null,
  customDisciplines?: string[]
): ReturnType<DisciplineType[]> => {
  const prefix = parent?.isLeaf ? ENDPOINTS.trainingSet : ENDPOINTS.disciplines
  const customDisciplinesSuffix = customDisciplines ? customDisciplines.join('&') : ''
  let suffix = parent?.id ?? customDisciplinesSuffix
  suffix = parent?.id ?? '' // TODO LUN-190 remove when api is ready
  const disciplines = useLoadFromEndpoint<ServerResponse[]>(`${prefix}/${suffix}`)
  return formatServerResponse(disciplines)
}
