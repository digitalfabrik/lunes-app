import { Discipline } from '../constants/endpoints'
import { ServerResponse } from './useLoadDisciplines'

export const formatDiscipline = (item: ServerResponse, parent?: Discipline | null): Discipline => ({
  ...item,
  numberOfChildren: item.total_discipline_children || item.total_training_sets || item.total_documents,
  //  The ServerResponse type is not completely correct
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  isLeaf: item.total_documents !== undefined,
  parentTitle: parent?.title ?? null,
  apiKey: parent?.apiKey,
  needsTrainingSetEndpoint: !!item.total_training_sets && item.total_training_sets > 0
})
