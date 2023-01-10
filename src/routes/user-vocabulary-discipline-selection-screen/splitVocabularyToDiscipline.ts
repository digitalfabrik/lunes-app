import { VocabularyItem } from '../../constants/endpoints'
import { getLabels } from '../../services/helpers'
import { DisciplineWithVocabulary } from './UserVocabularyDisciplineSelectionScreen'

const DISCIPLINE_SIZE = 10
let disciplinesWithVocabulary: DisciplineWithVocabulary[] = []

const createDisciplines = (vocabularySize: number) => {
  for (let i = 0; i < vocabularySize / DISCIPLINE_SIZE; i += 1) {
    disciplinesWithVocabulary.push({
      discipline: {
        id: i,
        title: `${getLabels().userVocabulary.practice.part} ${i + 1}`,
        description: '',
        icon: 'none',
        numberOfChildren: 1,
        isLeaf: true,
        parentTitle: getLabels().userVocabulary.myWords,
        needsTrainingSetEndpoint: true,
      },
      vocabulary: [],
    })
  }
}

const moveVocabularyToCorrectDiscipline = (vocabulary: VocabularyItem[]) => {
  vocabulary.forEach((item, index) => {
    disciplinesWithVocabulary[Math.floor(index / DISCIPLINE_SIZE)].vocabulary.push(item)
  })
}

const adjustChildrenSizeOfDisciplines = () => {
  disciplinesWithVocabulary = disciplinesWithVocabulary.map(item => ({
    ...item,
    discipline: {
      ...item.discipline,
      numberOfChildren: item.vocabulary.length,
    },
  }))
}

export const spiltVocabularyToDisciplines = (vocabulary: VocabularyItem[]): DisciplineWithVocabulary[] => {
  disciplinesWithVocabulary = []
  createDisciplines(vocabulary.length)
  moveVocabularyToCorrectDiscipline(vocabulary)
  adjustChildrenSizeOfDisciplines()
  return disciplinesWithVocabulary
}
