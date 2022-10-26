import { mocked } from 'jest-mock'

import { VOCABULARY_ITEM_TYPES } from '../../constants/data'
import { getFromEndpoint } from '../../services/axios'
import { loadVocabularyItems } from '../useLoadVocabularyItems'

jest.mock('../useLoadAsync')
jest.mock('../../services/axios')

const testData = [
  {
    alternatives: [
      {
        alt_word: 'Meterstab',
        article: 1,
      },
      {
        alt_word: 'Gliedermaßstab',
        article: 1,
      },
      {
        alt_word: 'Zoll-Stock',
        article: 1,
      },
    ],
    article: 1,
    audio: 'https://lunes-test.tuerantuer.org/media/audio/c966db1e-250e-11ec-991f-960000c17cb9.mp3',
    document_image: [],
    id: 17,
    word: 'Zollstock',
    word_type: 'Nomen',
  },
  {
    alternatives: [],
    article: 1,
    audio: 'https://lunes-test.tuerantuer.org/media/audio/Oelkanister-conv.mp3',
    document_image: [],
    id: 178,
    word: 'Ölkanister',
    word_type: 'Nomen',
  },
  {
    alternatives: [],
    article: 2,
    audio: 'https://lunes-test.tuerantuer.org/media/audio/Oelkreide-conv.mp3',
    document_image: [],
    id: 245,
    word: 'Ölkreide',
    word_type: 'Nomen',
  },
]

const expectedData = [
  {
    alternatives: [
      { article: { id: 1, value: 'der' }, word: 'Meterstab' },
      { article: { id: 1, value: 'der' }, word: 'Gliedermaßstab' },
      { article: { id: 1, value: 'der' }, word: 'Zoll-Stock' },
    ],
    article: { id: 1, value: 'der' },
    audio: 'https://lunes-test.tuerantuer.org/media/audio/c966db1e-250e-11ec-991f-960000c17cb9.mp3',
    image: [],
    id: 17,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Zollstock',
    word_type: 'Nomen',
  },
  {
    alternatives: [],
    article: { id: 1, value: 'der' },
    audio: 'https://lunes-test.tuerantuer.org/media/audio/Oelkanister-conv.mp3',
    image: [],
    id: 178,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Ölkanister',
    word_type: 'Nomen',
  },
  {
    alternatives: [],
    article: { id: 2, value: 'die' },
    audio: 'https://lunes-test.tuerantuer.org/media/audio/Oelkreide-conv.mp3',
    image: [],
    id: 245,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Ölkreide',
    word_type: 'Nomen',
  },
]

const discipline = {
  id: 1234,
  title: 'title',
  numberOfChildren: 12,
  isLeaf: false,
  description: '',
  icon: '',
  parentTitle: null,
  needsTrainingSetEndpoint: false,
}

describe('loadDocuments', () => {
  mocked(getFromEndpoint).mockImplementation(async () => testData)

  it('should get correctly', async () => {
    await loadVocabularyItems({ disciplineId: discipline.id })
    expect(getFromEndpoint).toHaveBeenCalledWith('documents/1234', undefined)
  })

  it('should map data correctly', async () => {
    const responseData = await loadVocabularyItems({ disciplineId: discipline.id })
    expect(responseData).toEqual(expectedData)
  })
})
