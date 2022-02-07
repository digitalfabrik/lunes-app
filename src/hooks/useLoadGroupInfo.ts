import { Discipline } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'

export interface ServerResponse {
  id: number
  name: string
  icon: string
  total_discipline_children: number
}

export const loadGroupInfo = async (apiKey: string): Promise<Discipline> => {
  const response = await getFromEndpoint<ServerResponse[]>('group_info', apiKey)
  return {
    ...response[0],
    title: response[0].name,
    apiKey,
    isLeaf: false,
    numberOfChildren: response[0].total_discipline_children,
    description: '',
    parentTitle: null,
    needsTrainingSetEndpoint: false
  }
}

export const useLoadGroupInfo = (apiKey: string): Return<Discipline> => useLoadAsync(loadGroupInfo, apiKey)
