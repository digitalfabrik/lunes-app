import { Article } from './data'

export interface Discipline {
  id: number
  title: string
  description: string
  icon: string
  numberOfChildren: number
  isLeaf: boolean
  isRoot: boolean
  apiKey?: string
  needsTrainingSetEndpoint: boolean
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

export type Documents = Document[]

export const ENDPOINTS = {
  disciplines: 'disciplines_by_level',
  disciplinesByGroup: 'disciplines_by_group',
  trainingSet: 'training_set',
  documents: 'documents/:id'
}
