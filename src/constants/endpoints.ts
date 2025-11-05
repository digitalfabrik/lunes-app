import { Article, VocabularyItemType } from './data'

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

export type AlternativeWord = {
  word: string
  article: Article
}

export type VocabularyItem = {
  id: number
  type: VocabularyItemType
  word: string
  article: Article
  images: string[]
  audio: string | null
  alternatives: AlternativeWord[]
  apiKey?: string
}

export type UserVocabularyItem = Omit<VocabularyItem, 'type'>

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
