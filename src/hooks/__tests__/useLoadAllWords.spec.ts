import { mocked } from 'jest-mock'

import { VocabularyItem } from '../../constants/endpoints'
import { StorageCache } from '../../services/Storage'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { loadAllVocabularyItems } from '../useLoadAllVocabularyItems'
import { loadAllWords } from '../useLoadAllWords'

jest.mock('../useLoadAllVocabularyItems')

describe('useLoadAllWords', () => {
  const lunesStandardVocabularyMock: VocabularyItem[] = new VocabularyItemBuilder(3).build()
  const userVocabularyMock: VocabularyItem[] = [{ ...new VocabularyItemBuilder(4).build()[3], type: 'user-created' }]

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  it('should return concatenation', async () => {
    mocked(loadAllVocabularyItems).mockImplementation(async () => lunesStandardVocabularyMock)
    await storageCache.setItem('userVocabulary', userVocabularyMock)
    const response = await loadAllWords(storageCache)
    expect(response).toHaveLength(4)
    expect(response.slice(0, 3)).toStrictEqual(lunesStandardVocabularyMock)
    expect(response[3]).toStrictEqual(userVocabularyMock[0])
  })

  it('should return error if readUserVocabulary has error', async () => {
    mocked(loadAllVocabularyItems).mockReturnValue(Promise.reject(new Error('no internet')))
    await storageCache.setItem('userVocabulary', userVocabularyMock)
    await expect(loadAllWords(storageCache)).rejects.toThrow('no internet')
  })

  it('should return userVocabulary if lunesVocabulary is empty', async () => {
    mocked(loadAllVocabularyItems).mockImplementation(async () => [])
    await storageCache.setItem('userVocabulary', userVocabularyMock)
    const response = await loadAllWords(storageCache)
    expect(response).toHaveLength(1)
  })

  it('should return lunesVocabulary if userVocabulary is empty', async () => {
    mocked(loadAllVocabularyItems).mockImplementation(async () => lunesStandardVocabularyMock)
    await storageCache.setItem('userVocabulary', [])
    const response = await loadAllWords(storageCache)
    expect(response).toHaveLength(3)
  })
})
