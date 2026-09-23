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
  // German respelling for loanwords, e.g. "Besee" for "Baiser". Only ever set by the CMS.
  pronunciation?: string
  exampleSentence?: {
    sentence: string
    audio: string
  }
  token?: string
}

export type StandardVocabularyItem = {
  id: StandardVocabularyId
} & VocabularyItem

export type UserVocabularyItem = {
  id: UserVocabularyId
} & VocabularyItem

export const pronunciationOrWord = ({ word, pronunciation }: VocabularyItem): string => pronunciation ?? word

export const isUserVocabularyItem = (vocabularyItem: VocabularyItem): vocabularyItem is UserVocabularyItem =>
  vocabularyItem.id.type === VocabularyItemTypes.UserCreated

export const serializeVocabularyItemId = (vocabularyItemId: VocabularyItemId): string => {
  if (vocabularyItemId.type === VocabularyItemTypes.UserCreated) {
    return `${vocabularyItemId.type}:${vocabularyItemId.index}`
  }
  if (vocabularyItemId.type === VocabularyItemTypes.Protected) {
    return `${vocabularyItemId.type}:${vocabularyItemId.protectedId}`
  }
  return `${vocabularyItemId.type}:${vocabularyItemId.id}`
}

export const areVocabularyItemIdsEqual = (
  vocabularyItemId1: VocabularyItemId,
  vocabularyItemId2: VocabularyItemId,
): boolean => serializeVocabularyItemId(vocabularyItemId1) === serializeVocabularyItemId(vocabularyItemId2)

export default VocabularyItem
