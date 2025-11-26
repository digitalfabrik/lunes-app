import { VocabularyItem } from '../../constants/endpoints'
import { getLabels } from '../../services/helpers'
import { UnitWithVocabulary } from './UserVocabularyUnitSelectionScreen'

const UNIT_SIZE = 10

const groupVocabulary = (vocabulary: VocabularyItem[]): VocabularyItem[][] => {
  const result: VocabularyItem[][] = []
  for (let i = 0; i < vocabulary.length / UNIT_SIZE; i += 1) {
    result.push(vocabulary.slice(i * UNIT_SIZE, (i + 1) * UNIT_SIZE))
  }
  return result
}

export const splitVocabularyIntoUnits = (vocabulary: VocabularyItem[]): UnitWithVocabulary[] => {
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
