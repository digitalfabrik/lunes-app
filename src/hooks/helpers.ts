import { Discipline } from '../constants/endpoints'

export type DisciplinesLoadingInfo =
  | {
      apiKey: string
    }
  | {
      parent: Discipline | null
    }

export const isTypeLoadGroupType = (
  value: DisciplinesLoadingInfo
): value is {
  apiKey: string
} => Object.prototype.hasOwnProperty.call(value, 'apiKey')

export interface ServerResponseDiscipline {
  id: number
  title: string
  description: string
  icon: string
  total_training_sets: number
  total_discipline_children: number
  total_documents: number
  nested_training_sets: number[]
}

export const formatDiscipline = (item: ServerResponseDiscipline, loadingInfo: DisciplinesLoadingInfo): Discipline => ({
  ...item,
  numberOfChildren: item.total_discipline_children || item.total_training_sets || item.total_documents,
  //  The ServerResponse type is not completely correct
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  isLeaf: item.total_documents !== undefined,
  parentTitle: !isTypeLoadGroupType(loadingInfo) && loadingInfo.parent ? loadingInfo.parent.title : null,
  apiKey: isTypeLoadGroupType(loadingInfo) ? loadingInfo.apiKey : loadingInfo.parent?.apiKey, // TODO make function for getting api key and reuse
  needsTrainingSetEndpoint: !!item.total_training_sets && item.total_training_sets > 0,
  leafDisciplines: item.nested_training_sets
})

export interface ServerResponseGroup {
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
  needsTrainingSetEndpoint: false
})
