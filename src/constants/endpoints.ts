import { Article } from './data'

export interface ProfessionType {
  id: number
  title: string
  description: string
  icon: string
  total_training_sets: number
}

export interface ProfessionSubcategoryType {
  id: number
  title: string
  description: string
  icon: string
  total_documents: number
}

export interface AlternativeWordType {
  alt_word: string
  article: number
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
    all: '/disciplines'
  },
  subCategories: {
    all: '/training_set/:id'
  },
  documents: {
    all: '/documents/:id'
  }
}
