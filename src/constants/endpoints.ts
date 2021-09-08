import { Article } from './data'

export interface DisciplineType {
  id: number
  title: string
  description: string
  icon: string
  numberOfChildren: number
  isLeaf: boolean
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
  professions: {
    all: '/disciplines_by_level'
  },
  subCategories: {
    all: '/training_set'
  },
  documents: {
    all: '/documents/:id'
  }
}
