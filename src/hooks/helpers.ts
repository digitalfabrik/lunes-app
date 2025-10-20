import { Discipline } from '../constants/endpoints'
import { JobId } from '../services/CmsApi'
import { RequestParams as DisciplinesRequestParams } from './useLoadDisciplines'

type ApiKey = {
  apiKey: string
}

export const isTypeLoadProtected = (value: JobId | DisciplinesRequestParams): value is ApiKey =>
  !!(value as ApiKey).apiKey

export type ServerResponseDiscipline = {
  id: number
  title: string
  description: string
  icon: string
  total_training_sets: number
  total_discipline_children: number
  total_documents: number
  nested_training_sets: number[]
}

export const formatDiscipline = (
  item: ServerResponseDiscipline,
  loadingInfo: DisciplinesRequestParams,
): Discipline => ({
  ...item,
  numberOfChildren: item.total_discipline_children || item.total_training_sets || item.total_documents,
  //  The ServerResponse type is not completely correct
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  isLeaf: item.total_documents !== undefined,
  parentTitle: !isTypeLoadProtected(loadingInfo) && loadingInfo.parent ? loadingInfo.parent.title : null,
  apiKey: isTypeLoadProtected(loadingInfo) ? loadingInfo.apiKey : loadingInfo.parent?.apiKey, // TODO make function for getting api key and reuse
  needsTrainingSetEndpoint: !!item.total_training_sets && item.total_training_sets > 0,
  leafDisciplines: item.nested_training_sets,
})

export type ServerResponseGroup = {
  id: number
  name: string
  icon: string
  total_discipline_children: number
}

export const formatGroup = (response: ServerResponseGroup[], apiKey: string): Discipline => ({
  ...response[0],
  title: response[0].name,
  apiKey,
  isLeaf: false,
  numberOfChildren: response[0].total_discipline_children,
  description: '',
  parentTitle: null,
  needsTrainingSetEndpoint: false,
})
