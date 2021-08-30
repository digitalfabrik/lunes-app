import useLoadFromEndpoint, { ReturnType } from './useLoadFromEndpoint'
import { DisciplineType, ENDPOINTS } from '../constants/endpoints'

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
      numberOfChildren:
        item.total_discipline_children > 0
          ? item.total_discipline_children
          : item.total_training_sets > 0
          ? item.total_training_sets
          : item.total_documents > 0
          ? item.total_documents
          : 0,
      isLeaf: item.total_discipline_children <= 0
    })) ?? []
  return { ...serverResponse, data: formattedServerResponse }
}

export const useLoadDisciplines = (parent: DisciplineType | null): ReturnType<DisciplineType[]> => {
  let url: string
  if (parent === null) {
    url = ENDPOINTS.professions.all
  } else {
    url = `${!parent.isLeaf ? ENDPOINTS.professions.all : ENDPOINTS.subCategories.all}/${parent?.id}`
  }
  const disciplines: ReturnType<ServerResponse[]> = useLoadFromEndpoint(url)
  return formatServerResponse(disciplines)
}
