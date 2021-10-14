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

export const useLoadDisciplines = (parent: DisciplineType | null): ReturnType<DisciplineType[]> => {
  const prefix = parent?.isLeaf ? ENDPOINTS.trainingSet : ENDPOINTS.disciplines
  const suffix = parent != null ? parent.id : ''
  const disciplines = useLoadFromEndpoint<ServerResponse[]>(`${prefix}/${suffix}`)
  return formatServerResponse(disciplines)
}
