export type UserVocabularyItemRef = {
  type: 'user-created'
  id: number
}

export type StandardVocabularyItemRef = {
  type: 'lunes-standard'
  id: number
}

type VocabularyItemRef = UserVocabularyItemRef | StandardVocabularyItemRef

export const areVocabularyItemRefsEqual = (a: VocabularyItemRef, b: VocabularyItemRef): boolean =>
  a.type === b.type && a.id === b.id

export default VocabularyItemRef
