export type StandardUnitId = {
  type: 'standard'
  id: number
}

export type UserVocabularyUnitId = {
  type: 'user-vocabulary-unit'
  id: number
}

export type UnitId = StandardUnitId | UserVocabularyUnitId

type Unit = {
  id: UnitId
  title: string
  description: string
  iconUrl: string | null
  numberWords: number
}

export type StandardUnit = {
  id: StandardUnitId
} & Unit

export type UserVocabularyUnit = {
  id: UserVocabularyUnitId
} & Unit

export default Unit
