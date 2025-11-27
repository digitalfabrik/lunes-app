import { UserVocabularyUnit } from '../../models/Unit'
import { UserVocabularyItem } from '../../models/VocabularyItem'
import { getLabels } from '../../services/helpers'

const UNIT_SIZE = 10

export type UnitWithVocabulary = {
  unit: UserVocabularyUnit
  vocabulary: UserVocabularyItem[]
}

const groupVocabulary = (vocabulary: readonly UserVocabularyItem[]): UserVocabularyItem[][] => {
  const result: UserVocabularyItem[][] = []
  for (let i = 0; i < vocabulary.length / UNIT_SIZE; i += 1) {
    result.push(vocabulary.slice(i * UNIT_SIZE, (i + 1) * UNIT_SIZE))
  }
  return result
}

export const splitVocabularyIntoUnits = (vocabulary: readonly UserVocabularyItem[]): UnitWithVocabulary[] => {
  const groups = groupVocabulary(vocabulary)
  return groups.map((vocabulary, index) => ({
    unit: {
      id: { index, type: 'user-vocabulary-unit' },
      title: `${getLabels().userVocabulary.practice.part} ${index + 1}`,
      description: '',
      numberWords: vocabulary.length,
      iconUrl: null,
    },
    vocabulary,
  }))
}
