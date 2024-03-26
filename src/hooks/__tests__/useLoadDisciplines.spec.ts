import { mocked } from 'jest-mock'

import { Discipline } from '../../constants/endpoints'
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
  parentTitle: null,
  needsTrainingSetEndpoint: false,
  leafDisciplines: [28],
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
    total_discipline_children: 0,
    nested_training_sets: [28],
  },
  // Training Set
  {
    id: 28,
    title: 'Sicherheit & Arbeitsschutz',
    description: '',
    icon: 'https://lunes-test.tuerantuer.org/media/images/do-not-touch.png',
    total_documents: 9,
  },
  // Group
  {
    created_by: 2,
    description: 'Discipline to test custom stuff',
    icon: 'https://lunes-test.tuerantuer.org/media/images/1cfe1860-3166-11ec-bdd1-960000c17cb9.jpg',
    id: 21,
    title: 'Test Discipline First Level',
    total_discipline_children: 0,
    total_training_sets: 1,
  },
]

const expectedData = (parent: Discipline | null): Array<Discipline & Record<string, unknown>> => [
  {
    apiKey: undefined,
    created_by: null,
    description: 'Wörter zu den Themen Metall, Elektro und Maschinen',
    icon: 'https://lunes-test.tuerantuer.org/media/images/icon-metall-elektro-maschienen3x.png',
    id: 3,
    isLeaf: false,
    parentTitle: parent?.title ?? null,
    numberOfChildren: 7,
    title: 'Metall, Elektro & Maschinen',
    total_discipline_children: 0,
    total_training_sets: 7,
    needsTrainingSetEndpoint: true,
    nested_training_sets: [28],
    leafDisciplines: [28],
  },
  {
    apiKey: undefined,
    description: '',
    icon: 'https://lunes-test.tuerantuer.org/media/images/do-not-touch.png',
    id: 28,
    isLeaf: true,
    parentTitle: parent?.title ?? null,
    numberOfChildren: 9,
    title: 'Sicherheit & Arbeitsschutz',
    total_documents: 9,
    needsTrainingSetEndpoint: false,
    leafDisciplines: undefined,
  },
  {
    apiKey: undefined,
    created_by: 2,
    description: 'Discipline to test custom stuff',
    icon: 'https://lunes-test.tuerantuer.org/media/images/1cfe1860-3166-11ec-bdd1-960000c17cb9.jpg',
    id: 21,
    isLeaf: false,
    parentTitle: parent?.title ?? null,
    numberOfChildren: 1,
    title: 'Test Discipline First Level',
    total_discipline_children: 0,
    total_training_sets: 1,
    needsTrainingSetEndpoint: true,
    leafDisciplines: undefined,
  },
]

describe('loadDiscipline', () => {
  mocked<typeof getFromEndpoint<typeof testData>>(getFromEndpoint).mockImplementation(async () => testData)

  describe('it should use correct url if', () => {
    it('has no parent', async () => {
      await loadDisciplines({ parent: null })
      expect(getFromEndpoint).toHaveBeenCalledWith('disciplines_by_level/', undefined)
    })

    it('has parent without an api key', async () => {
      await loadDisciplines({ parent: { ...parent, isLeaf: false } })
      expect(getFromEndpoint).toHaveBeenCalledWith('disciplines_by_level/1234', undefined)
    })

    it('has training sets as children', async () => {
      await loadDisciplines({ parent: { ...parent, needsTrainingSetEndpoint: true } })
      expect(getFromEndpoint).toHaveBeenCalledWith('training_set/1234', undefined)
    })

    it('has a parent with an api key', async () => {
      const apiKeyParent = {
        ...parent,
        isLeaf: false,
        apiKey: 'my_api_key',
      }
      await loadDisciplines({ parent: apiKeyParent })
      expect(getFromEndpoint).toHaveBeenCalledWith('disciplines_by_group/1234', 'my_api_key')
    })

    it('has no parent but an api key', async () => {
      await loadDisciplines({ apiKey: 'api-key123' })
      expect(getFromEndpoint).toHaveBeenCalledWith('group_info', 'api-key123')
    })
  })

  it('should map data correctly for set parent', async () => {
    const responseData = await loadDisciplines({ parent })
    expect(responseData).toEqual(expectedData(parent))
  })

  it('should map data correctly for null parent', async () => {
    const responseData = await loadDisciplines({ parent: null })
    expect(responseData).toEqual(expectedData(null))
  })

  it('should map data correctly for group', async () => {
    const responseData = await loadDisciplines({ apiKey: 'api-key-123' })
    expect(responseData).toEqual(expectedData(null).map(item => ({ ...item, apiKey: 'api-key-123' })))
  })
})
