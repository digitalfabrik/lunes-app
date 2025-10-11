import Article from './Article'
import VocabularyItemType from './VocabularyItemType'

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
}

export default VocabularyItem
