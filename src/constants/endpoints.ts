import { Article, VocabularyItemType } from './data'

export interface Discipline {
  id: number
  title: string
  description: string
  icon: string
  numberOfChildren: number
  isLeaf: boolean
  parentTitle: string | null // if null then it is the root discipline
  apiKey?: string
  needsTrainingSetEndpoint: boolean // api endpoint requires different endpoint for leaf disciplines
  leafDisciplines?: number[]
}

export interface AlternativeWord {
  word: string
  article: Article
}

export interface Image {
  id: number
  image: string
}

export type Images = Image[]

export interface VocabularyItem {
  id: number
  type: VocabularyItemType
  word: string
  article: Article
  images: Images
  audio: string
  alternatives: AlternativeWord[]
  apiKey?: string
}

export const ENDPOINTS = {
  discipline: 'disciplines',
  disciplines: 'disciplines_by_level',
  disciplinesByGroup: 'disciplines_by_group',
  groupInfo: 'group_info',
  trainingSet: 'training_set',
  trainingSets: 'training_sets',
  vocabularyItems: 'documents/:id',
  vocabularyItem: 'words',
  feedback: 'feedback',
}

export const ForbiddenError = 'Request failed with status code 403'
export const NetworkError = 'Network Error'
