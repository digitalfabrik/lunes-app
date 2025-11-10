import { Article } from '../constants/data'

export const VocabularyItemTypes = {
  Standard: 'lunes-standard',
  UserCreated: 'user-created',
  Protected: 'lunes-protected',
} as const

export type AlternativeWord = {
  word: string
  article: Article
}

export type StandardVocabularyId = {
  type: typeof VocabularyItemTypes.Standard
  id: number
}

export type UserVocabularyId = {
  type: typeof VocabularyItemTypes.UserCreated
  index: number
}

export type ProtectedVocabularyId = {
  type: typeof VocabularyItemTypes.Protected
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
  // FIXME: Decide whether this really belongs here
  exampleSentence?: {
    sentence: string
    audio: string
  }
}

export type StandardVocabularyItem = {
  id: StandardVocabularyId
} & VocabularyItem

export type UserVocabularyItem = {
  id: UserVocabularyId
} & VocabularyItem

export const isUserVocabularyItem = (vocabularyItem: VocabularyItem): vocabularyItem is UserVocabularyItem =>
  vocabularyItem.id.type === VocabularyItemTypes.UserCreated

export const areVocabularyItemIdsEqual = (
  vocabularyItemId1: VocabularyItemId,
  vocabularyItemId2: VocabularyItemId,
): boolean => JSON.stringify(vocabularyItemId1) === JSON.stringify(vocabularyItemId2)

export default VocabularyItem
