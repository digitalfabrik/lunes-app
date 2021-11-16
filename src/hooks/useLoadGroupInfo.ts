import { DisciplineType } from '../constants/endpoints'
import useLoadFromEndpoint, { getFromEndpoint, ReturnType } from './useLoadFromEndpoint'

interface ServerResponse {
  id: number
  name: string
  icon: string
  total_discipline_children: number
}

export const loadGroupInfo = async (apiKey: string): Promise<DisciplineType> => {
  const response = await getFromEndpoint<ServerResponse[]>('group_info', apiKey)
  return {
    ...response[0],
    title: response[0].name,
    apiKey: apiKey,
    isLeaf: false,
    numberOfChildren: response[0].total_discipline_children,
    description: ''
  }
}

export const useLoadGroupInfo = (apiKey: string): ReturnType<DisciplineType> =>
  useLoadFromEndpoint(loadGroupInfo, apiKey)
