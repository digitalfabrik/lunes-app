import { mocked } from 'jest-mock'

import { StandardVocabularyItem, UserVocabularyItem } from '../../model/VocabularyItem'
import { getWords } from '../../services/CmsApi'
import { StorageCache } from '../../services/Storage'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { getAllWords } from '../useGetAllWords'

jest.mock('../../services/CmsApi')

describe('useGetAllWords', () => {
  const lunesStandardVocabularyMock: StandardVocabularyItem[] = new VocabularyItemBuilder(3).build()
  const userVocabularyMock: UserVocabularyItem[] = [
    { ...new VocabularyItemBuilder(4).build()[3], ref: { type: 'user-created', id: 0 } },
  ]

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  it('should return concatenation', async () => {
    mocked(getWords).mockImplementation(async () => lunesStandardVocabularyMock)
    await storageCache.setItem('userVocabulary', userVocabularyMock)
    const response = await getAllWords(storageCache)
    expect(response).toHaveLength(4)
    expect(response.slice(0, 3)).toStrictEqual(lunesStandardVocabularyMock)
    expect(response[3]).toStrictEqual(userVocabularyMock[0])
  })

  it('should return error if readUserVocabulary has error', async () => {
    mocked(getWords).mockReturnValue(Promise.reject(new Error('no internet')))
    await storageCache.setItem('userVocabulary', userVocabularyMock)
    await expect(getAllWords(storageCache)).rejects.toThrow('no internet')
  })

  it('should return userVocabulary if lunesVocabulary is empty', async () => {
    mocked(getWords).mockImplementation(async () => [])
    await storageCache.setItem('userVocabulary', userVocabularyMock)
    const response = await getAllWords(storageCache)
    expect(response).toHaveLength(1)
  })

  it('should return lunesVocabulary if userVocabulary is empty', async () => {
    mocked(getWords).mockImplementation(async () => lunesStandardVocabularyMock)
    await storageCache.setItem('userVocabulary', [])
    const response = await getAllWords(storageCache)
    expect(response).toHaveLength(3)
  })
})
