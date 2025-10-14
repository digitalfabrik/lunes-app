import Article from './Article'
import VocabularyItemRef, {
  areVocabularyItemRefsEqual,
  StandardVocabularyItemRef,
  UserVocabularyItemRef,
} from './VocabularyItemRef'

export type AlternativeWord = {
  word: string
  article: Article
}

type VocabularyItem = {
  ref: VocabularyItemRef
  word: string
  article: Article
  images: string[]
  audio: string | null
  alternatives: AlternativeWord[]
}

export type UserVocabularyItem = VocabularyItem & { ref: UserVocabularyItemRef }
export type StandardVocabularyItem = VocabularyItem & { ref: StandardVocabularyItemRef }

export const areVocabularyItemsEqual = (a: VocabularyItem, b: VocabularyItem): boolean =>
  areVocabularyItemRefsEqual(a.ref, b.ref)

export const isUserVocabularyItem = (item: VocabularyItem): item is UserVocabularyItem =>
  item.ref.type === 'user-created'
export const isStandardVocabularyItem = (item: VocabularyItem): item is StandardVocabularyItem =>
  item.ref.type === 'lunes-standard'

export default VocabularyItem
