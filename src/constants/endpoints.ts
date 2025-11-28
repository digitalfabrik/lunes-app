import { Article, VocabularyItemType } from './data'

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

export const ForbiddenError = 'Request failed with status code 403'
export const NetworkError = 'Network Error'
