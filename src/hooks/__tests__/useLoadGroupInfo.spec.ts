import { mocked } from 'jest-mock'

import { getFromEndpoint } from '../../services/axios'
import { loadGroupInfo } from '../useLoadGroupInfo'

jest.mock('../useLoadAsync')
jest.mock('../../services/axios')

const apiKey = 'my_api_key'

const testData = [
  {
    icon: 'https://lunes-test.tuerantuer.org/media/images/1cfe1860-3166-11ec-bdd1-960000c17cb9.jpg',
    id: 2,
    name: 'Test Gruppe',
    total_discipline_children: 2
  }
]

const expectedData = {
  ...testData[0],
  title: testData[0].name,
  apiKey,
  isLeaf: false,
  isRoot: true,
  numberOfChildren: testData[0].total_discipline_children,
  description: '',
  needsTrainingSetEndpoint: false
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('loadGroupInfo', () => {
  mocked(getFromEndpoint).mockImplementation(async () => testData)

  it('should get correctly', async () => {
    await loadGroupInfo(apiKey)
    expect(getFromEndpoint).toHaveBeenCalledWith('group_info', apiKey)
  })

  it('should map data correctly', async () => {
    const responseData = await loadGroupInfo(apiKey)
    expect(responseData).toEqual(expectedData)
  })
})
