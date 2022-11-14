import { mocked } from 'jest-mock'

import { Discipline } from '../../constants/endpoints'
import { getFromEndpoint } from '../../services/axios'
import { loadDiscipline } from '../useLoadDiscipline'

jest.mock('../../services/axios')

const testData = [
  // Discipline
  {
    id: 3,
    title: 'Metall, Elektro & Maschinen',
    description: 'Vokabeln zu Bau, Farbe & Holz',
    icon: 'https://lunes-test.tuerantuer.org/media/images/xx.png',
    created_by: 1,
    total_training_sets: 0,
    total_discipline_children: 7,
    nested_training_sets: [28],
  },
  // Group
  [
    {
      id: 3,
      name: 'Metall, Elektro & Maschinen',
      icon: 'https://lunes-test.tuerantuer.org/media/images/xx.png',
      total_discipline_children: 7,
    },
  ],
]

const expectedData: Array<Discipline & Record<string, unknown>> = [
  {
    apiKey: undefined,
    created_by: 1,
    description: 'Vokabeln zu Bau, Farbe & Holz',
    icon: 'https://lunes-test.tuerantuer.org/media/images/xx.png',
    id: 3,
    isLeaf: false,
    parentTitle: null,
    numberOfChildren: 7,
    title: 'Metall, Elektro & Maschinen',
    total_discipline_children: 7,
    total_training_sets: 0,
    needsTrainingSetEndpoint: false,
    nested_training_sets: [28],
    leafDisciplines: [28],
  },
  {
    apiKey: 'api-key123',
    description: '',
    icon: 'https://lunes-test.tuerantuer.org/media/images/xx.png',
    id: 3,
    isLeaf: false,
    parentTitle: null,
    numberOfChildren: 7,
    title: 'Metall, Elektro & Maschinen',
    name: 'Metall, Elektro & Maschinen',
    total_discipline_children: 7,
    needsTrainingSetEndpoint: false,
  },
]

describe('loadDiscipline', () => {
  it('should map data correctly for discipline', async () => {
    mocked(getFromEndpoint).mockImplementation(async () => testData[0])
    const responseData = await loadDiscipline({ disciplineId: 3 })
    expect(responseData).toEqual(expectedData[0])
  })

  it('should map data correctly for group', async () => {
    mocked(getFromEndpoint).mockImplementation(async () => testData[1])
    const responseData = await loadDiscipline({ apiKey: 'api-key123' })
    expect(responseData).toEqual(expectedData[1])
  })
})
