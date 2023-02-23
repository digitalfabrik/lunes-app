import { mocked } from 'jest-mock'

import { VocabularyItem } from '../../constants/endpoints'
import { getUserVocabularyItems } from '../../services/AsyncStorage'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { getAllWords } from '../useGetAllWords'
import { loadAllVocabularyItems } from '../useLoadAllVocabularyItems'

jest.mock('../../services/axios')
jest.mock('../useLoadAllVocabularyItems')
jest.mock('../../services/AsyncStorage')

describe('useGetAllWords', () => {
  const lunesStandardVocabularyMock: VocabularyItem[] = new VocabularyItemBuilder(3).build()
  const userVocabularyMock: VocabularyItem[] = [new VocabularyItemBuilder(4).build()[3]]

  it('should return concatenation', async () => {
    mocked(loadAllVocabularyItems).mockImplementation(async () => lunesStandardVocabularyMock)
    mocked(getUserVocabularyItems).mockImplementation(async () => userVocabularyMock)
    const response = await getAllWords()
    expect(response).toHaveLength(4)
    expect(response.slice(0, 3)).toStrictEqual(lunesStandardVocabularyMock)
    expect(response[3]).toBe(userVocabularyMock[0])
  })

  it('should return error if readUserVocabulary has error', async () => {
    mocked(loadAllVocabularyItems).mockReturnValue(Promise.reject(new Error('no internet')))
    mocked(getUserVocabularyItems).mockImplementation(async () => userVocabularyMock)
    await expect(getAllWords()).rejects.toThrow('no internet')
  })

  it('should return error if useLoadVocabulary has error', async () => {
    mocked(loadAllVocabularyItems).mockImplementation(async () => lunesStandardVocabularyMock)
    mocked(getUserVocabularyItems).mockReturnValue(Promise.reject(new Error('read data error')))
    await expect(getAllWords()).rejects.toThrow('read data error')
  })

  it('should return userVocabulary if lunesVocabulary is empty', async () => {
    mocked(loadAllVocabularyItems).mockImplementation(async () => [])
    mocked(getUserVocabularyItems).mockImplementation(async () => userVocabularyMock)
    const response = await getAllWords()
    expect(response).toHaveLength(1)
  })

  it('should return lunesVocabulary if userVocabulary is empty', async () => {
    mocked(loadAllVocabularyItems).mockImplementation(async () => lunesStandardVocabularyMock)
    mocked(getUserVocabularyItems).mockImplementation(async () => [])
    const response = await getAllWords()
    expect(response).toHaveLength(3)
  })
})
