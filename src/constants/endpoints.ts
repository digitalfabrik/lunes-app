export interface ProfessionType {
  id: number
  title: string
  description: string
  icon: string
  total_training_sets: number
}

export type ProfessionsType = ProfessionType[]

export interface ProfessionSubcategoryType {
  id: number
  title: string
  description: string
  icon: string
  total_documents: number
}

export type ProfessionSubcategoriesType = ProfessionSubcategoryType[]

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
