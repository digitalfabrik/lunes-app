export const VOCABULARY_ITEM_TYPES = {
  lunesStandard: 'lunes-standard',
  userCreated: 'user-created',
} as const

type VocabularyItemType = (typeof VOCABULARY_ITEM_TYPES)[keyof typeof VOCABULARY_ITEM_TYPES]

export default VocabularyItemType
