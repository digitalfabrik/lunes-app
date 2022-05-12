import { Article } from './data'

export interface Discipline {
  id: number
  title: string
  description: string
  icon: string
  numberOfChildren: number
  isLeaf: boolean
  parentTitle: string | null // if null then it is the root discipline
  apiKey?: string
  needsTrainingSetEndpoint: boolean
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

export interface Document {
  id: number
  word: string
  article: Article
  document_image: Images
  audio: string
  alternatives: AlternativeWord[]
}

export const ENDPOINTS = {
  discipline: 'disciplines',
  disciplines: 'disciplines_by_level',
  disciplinesByGroup: 'disciplines_by_group',
  groupInfo: 'group_info',
  trainingSet: 'training_set',
  documents: 'documents/:id'
}
