import { DisciplineType } from '../constants/endpoints'
import useLoadFromEndpoint, { ReturnType } from './useLoadFromEndpoint'

interface ServerResponse {
  id: number
  name: string
  icon: string
  total_discipline_children: number
}

export const useLoadGroupInfo = (apiKey: string): ReturnType<DisciplineType> => {
  const serverResponse = useLoadFromEndpoint<ServerResponse[]>('group_info', apiKey)
  const customDiscipline = serverResponse?.data
    ? {
        ...serverResponse.data[0],
        title: serverResponse.data[0].name,
        apiKey: apiKey,
        isLeaf: false,
        numberOfChildren: serverResponse.data[0].total_discipline_children,
        description: ''
      }
    : null
  return { ...serverResponse, data: customDiscipline }
}
