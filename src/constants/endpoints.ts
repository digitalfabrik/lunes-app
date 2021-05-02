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
  article: string
}

export interface DocumentType {
  id: number
  word: string
  article: string
  document_image: Array<{ id: number; image: string }>
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
