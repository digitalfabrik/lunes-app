import { mocked } from 'ts-jest/utils'

import { getFromEndpoint } from '../../services/axios'
import { loadDisciplines } from '../useLoadDisciplines'

jest.mock('../../services/axios')

const parent = {
  id: 1234,
  title: 'title',
  numberOfChildren: 12,
  isLeaf: false,
  description: '',
  icon: '',
  isRoot: true,
  needsTrainingSetEndpoint: false
}

const testData = [
  // Discipline
  {
    id: 3,
    title: 'Metall, Elektro & Maschinen',
    description: 'Wörter zu den Themen Metall, Elektro und Maschinen',
    icon: 'https://lunes-test.tuerantuer.org/media/images/icon-metall-elektro-maschienen3x.png',
    created_by: null,
    total_training_sets: 7,
    total_discipline_children: 0
  },
  // Training Set
  {
    id: 28,
    title: 'Sicherheit & Arbeitsschutz',
    description: '',
    icon: 'https://lunes-test.tuerantuer.org/media/images/do-not-touch.png',
    total_documents: 9
  },
  // Group
  {
    created_by: 2,
    description: 'Discipline to test custom stuff',
    icon: null,
    id: 21,
    title: 'Test Discipline First Level',
    total_discipline_children: 0,
    total_training_sets: 1
  }
]

const expectedData = [
  {
    apiKey: undefined,
    created_by: null,
    description: 'Wörter zu den Themen Metall, Elektro und Maschinen',
    icon: 'https://lunes-test.tuerantuer.org/media/images/icon-metall-elektro-maschienen3x.png',
    id: 3,
    isLeaf: false,
    isRoot: true,
    numberOfChildren: 7,
    title: 'Metall, Elektro & Maschinen',
    total_discipline_children: 0,
    total_training_sets: 7,
    needsTrainingSetEndpoint: true
  },
  {
    apiKey: undefined,
    description: '',
    icon: 'https://lunes-test.tuerantuer.org/media/images/do-not-touch.png',
    id: 28,
    isLeaf: true,
    isRoot: true,
    numberOfChildren: 9,
    title: 'Sicherheit & Arbeitsschutz',
    total_documents: 9,
    needsTrainingSetEndpoint: false
  },
  {
    apiKey: undefined,
    created_by: 2,
    description: 'Discipline to test custom stuff',
    icon: null,
    id: 21,
    isLeaf: false,
    isRoot: true,
    numberOfChildren: 1,
    title: 'Test Discipline First Level',
    total_discipline_children: 0,
    total_training_sets: 1,
    needsTrainingSetEndpoint: true
  }
]

beforeEach(() => {
  jest.clearAllMocks()
})

describe('loadDiscipline', () => {
  mocked(getFromEndpoint).mockImplementation(async () => testData)

  describe('it should use correct url if', () => {
    it('has no parent', async () => {
      await loadDisciplines(null)
      expect(getFromEndpoint).toHaveBeenCalledWith('disciplines_by_level/', undefined)
    })

    it('has parent without an api key', async () => {
      await loadDisciplines({ ...parent, isLeaf: false })
      expect(getFromEndpoint).toHaveBeenCalledWith('disciplines_by_level/1234', undefined)
    })

    it('has training sets as children', async () => {
      await loadDisciplines({ ...parent, needsTrainingSetEndpoint: true })
      expect(getFromEndpoint).toHaveBeenCalledWith('training_set/1234', undefined)
    })

    it('has a parent with an api key', async () => {
      const apiKeyParent = {
        ...parent,
        isLeaf: false,
        apiKey: 'my_api_key'
      }
      await loadDisciplines(apiKeyParent)
      expect(getFromEndpoint).toHaveBeenCalledWith('disciplines_by_group/1234', 'my_api_key')
    })
  })

  it('should map data correctly', async () => {
    const responseData = await loadDisciplines(null)
    expect(responseData).toEqual(expectedData)
  })
})
