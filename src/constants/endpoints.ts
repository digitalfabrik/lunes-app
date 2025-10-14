export type Sponsor = {
  name: string
  logo?: string
  url?: string
}

export type Discipline = {
  id: number
  title: string
  description: string
  icon?: string
  numberOfChildren: number
  isLeaf: boolean
  parentTitle: string | null // if null then it is the root discipline
  apiKey?: string
  needsTrainingSetEndpoint: boolean // api endpoint requires different endpoint for leaf disciplines
  leafDisciplines?: number[]
}

export const ENDPOINTS = {
  discipline: 'disciplines',
  disciplines: 'disciplines_by_level',
  disciplinesByGroup: 'disciplines_by_group',
  groupInfo: 'group_info',
  trainingSet: 'training_set',
  trainingSets: 'training_sets',
  vocabularyItems: 'documents/:id',
  feedback: 'feedback',
  sponsors: 'sponsors',
}

export const ForbiddenError = 'Request failed with status code 403'
export const NetworkError = 'Network Error'
