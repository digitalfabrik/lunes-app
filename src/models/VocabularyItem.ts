import { Article } from '../constants/data'

export type AlternativeWord = {
  word: string
  article: Article
}

export type StandardVocabularyId = {
  type: 'lunes-standard'
  id: number
}

export type UserVocabularyId = {
  type: 'user-created'
  index: number
}

export type ProtectedVocabularyId = {
  type: 'lunes-protected'
  protectedId: number
  apiKey: string
}

export type VocabularyItemId = StandardVocabularyId | UserVocabularyId | ProtectedVocabularyId

type VocabularyItem = {
  id: VocabularyItemId
  word: string
  article: Article
  images: string[]
  audio: string | null
  alternatives: AlternativeWord[]
}

export type StandardVocabularyItem = {
  id: StandardVocabularyId
} & VocabularyItem

export type UserVocabularyItem = {
  id: UserVocabularyId
} & VocabularyItem

export const isUserVocabularyItem = (vocabularyItem: VocabularyItem): vocabularyItem is UserVocabularyItem =>
  vocabularyItem.id.type === 'user-created'

export const areVocabularyItemIdsEqual = (
  vocabularyItemId1: VocabularyItemId,
  vocabularyItemId2: VocabularyItemId,
): boolean => JSON.stringify(vocabularyItemId1) === JSON.stringify(vocabularyItemId2)

export default VocabularyItem
