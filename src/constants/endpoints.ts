import { Article } from './data'

export interface DisciplineType {
  id: number
  title: string
  description: string
  icon: string
  numberOfChildren: number
  isLeaf: boolean
  apiKey?: string
}

export interface AlternativeWordType {
  word: string
  article: Article
}

export interface ImageType {
  id: number
  image: string
}

export type ImagesType = ImageType[]

export interface DocumentType {
  id: number
  word: string
  article: Article
  document_image: ImagesType
  audio: string
  alternatives: AlternativeWordType[]
}

export type DocumentsType = DocumentType[]

export const ENDPOINTS = {
  disciplines: 'disciplines_by_level',
  disciplinesByGroup: 'disciplines_by_group',
  trainingSet: 'training_set',
  documents: 'documents/:id'
}
