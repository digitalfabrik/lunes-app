import { VocabularyItem } from '../../constants/endpoints'
import { getLabels } from '../../services/helpers'
import { UnitWithVocabulary } from './UserVocabularyUnitSelectionScreen'

const DISCIPLINE_SIZE = 10
let unitsWithVocabulary: UnitWithVocabulary[] = []

const createUnits = (vocabularySize: number) => {
  for (let i = 0; i < vocabularySize / DISCIPLINE_SIZE; i += 1) {
    unitsWithVocabulary.push({
      unit: {
        id: { id: i, type: 'user-vocabulary-unit' },
        title: `${getLabels().userVocabulary.practice.part} ${i + 1}`,
        description: '',
        numberWords: 1,
        iconUrl: null,
      },
      vocabulary: [],
    })
  }
}

const moveVocabularyToCorrectDiscipline = (vocabulary: VocabularyItem[]) => {
  vocabulary.forEach((item, index) => {
    unitsWithVocabulary[Math.floor(index / DISCIPLINE_SIZE)].vocabulary.push(item)
  })
}

const adjustChildrenSizeOfDisciplines = () => {
  unitsWithVocabulary = unitsWithVocabulary.map(item => ({
    ...item,
    unit: {
      ...item.unit,
      numberOfChildren: item.vocabulary.length,
    },
  }))
}

export const splitVocabularyIntoDisciplines = (vocabulary: VocabularyItem[]): UnitWithVocabulary[] => {
  unitsWithVocabulary = []
  createUnits(vocabulary.length)
  moveVocabularyToCorrectDiscipline(vocabulary)
  adjustChildrenSizeOfDisciplines()
  return unitsWithVocabulary
}
