import { StandardUnit, UserVocabularyUnit } from '../model/Unit'

const mockUnits: StandardUnit[] = [
  {
    id: { type: 'standard', id: 1 },
    iconUrl: null,
    numberWords: 20,
    title: 'Unit 1',
    description: 'Unit 1 description',
  },
  {
    id: { type: 'standard', id: 2 },
    iconUrl: null,
    numberWords: 42,
    title: 'Unit 2',
    description: 'Unit 2 description',
  },
  {
    id: { type: 'standard', id: 3 },
    iconUrl: null,
    numberWords: 1,
    title: 'Unit 3',
    description: 'Unit 3 description',
  },
]

export const mockUserVocabularyUnits: UserVocabularyUnit[] = [
  {
    id: { type: 'user-vocabulary-unit', id: 1 },
    iconUrl: null,
    numberWords: 20,
    title: 'Unit 1',
    description: 'User unit 1 description',
  },
  {
    id: { type: 'user-vocabulary-unit', id: 2 },
    iconUrl: null,
    numberWords: 42,
    title: 'Unit 2',
    description: 'User unit 2 description',
  },
  {
    id: { type: 'user-vocabulary-unit', id: 3 },
    iconUrl: null,
    numberWords: 1,
    title: 'Unit 3',
    description: 'User unit 3 description',
  },
]

export default mockUnits
