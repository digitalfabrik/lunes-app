import { Article, VocabularyItemType } from '../constants/data'

export type AlternativeWord = {
  word: string
  article: Article
}

type VocabularyItem = {
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

export default VocabularyItem
