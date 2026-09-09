import { mocked } from 'jest-mock'

import { StandardVocabularyItem, UserVocabularyItem } from '../../models/VocabularyItem'
import { getWords, getWordsForKey } from '../../services/CmsApi'
import { StorageCache } from '../../services/Storage'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { loadAllWords } from '../useLoadAllWords'

jest.mock('../../services/CmsApi')

describe('useLoadAllWords', () => {
  const lunesStandardVocabularyMock: StandardVocabularyItem[] = new VocabularyItemBuilder(3).build()
  const userVocabularyMock: UserVocabularyItem[] = [new VocabularyItemBuilder(4).buildUserVocabulary()[3]!]

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
    mocked(getWordsForKey).mockImplementation(async () => [])
  })

  it('should return concatenation', async () => {
    mocked(getWords).mockImplementation(async () => lunesStandardVocabularyMock)
    await storageCache.setItem('userVocabulary', userVocabularyMock)
    const response = await loadAllWords(storageCache)
    expect(response).toHaveLength(4)
    expect(response.slice(0, 3)).toStrictEqual(lunesStandardVocabularyMock)
    expect(response[3]).toStrictEqual(userVocabularyMock[0])
  })

  it('should return error if readUserVocabulary has error', async () => {
    mocked(getWords).mockReturnValue(Promise.reject(new Error('no internet')))
    await storageCache.setItem('userVocabulary', userVocabularyMock)
    await expect(loadAllWords(storageCache)).rejects.toThrow('no internet')
  })

  it('should return userVocabulary if lunesVocabulary is empty', async () => {
    mocked(getWords).mockImplementation(async () => [])
    await storageCache.setItem('userVocabulary', userVocabularyMock)
    const response = await loadAllWords(storageCache)
    expect(response).toHaveLength(1)
  })

  it('should return lunesVocabulary if userVocabulary is empty', async () => {
    mocked(getWords).mockImplementation(async () => lunesStandardVocabularyMock)
    await storageCache.setItem('userVocabulary', [])
    const response = await loadAllWords(storageCache)
    expect(response).toHaveLength(3)
  })

  describe('when a catalog was redeemed', () => {
    const catalogVocabularyMock: StandardVocabularyItem[] = new VocabularyItemBuilder(2)
      .build()
      .map((item, index) => ({ ...item, id: { ...item.id, id: 100 + index }, apiKey: 'telc_key' }))

    it('should request the words of every redeemed catalog and append them', async () => {
      mocked(getWords).mockImplementation(async () => lunesStandardVocabularyMock)
      mocked(getWordsForKey).mockImplementation(async () => catalogVocabularyMock)
      await storageCache.setItem('userVocabulary', [])
      await storageCache.setItem('catalogs', [
        { apiKey: 'telc_key', name: 'telc gGmbH', shortName: 'telc', jobIds: [7] },
      ])

      const response = await loadAllWords(storageCache)

      expect(getWordsForKey).toHaveBeenCalledWith('telc_key')
      expect(response).toHaveLength(lunesStandardVocabularyMock.length + catalogVocabularyMock.length)
    })

    it('should not return a word twice if the key also selects public words', async () => {
      mocked(getWords).mockImplementation(async () => lunesStandardVocabularyMock)
      mocked(getWordsForKey).mockImplementation(async () => lunesStandardVocabularyMock)
      await storageCache.setItem('userVocabulary', [])
      await storageCache.setItem('catalogs', [
        { apiKey: 'telc_key', name: 'telc gGmbH', shortName: 'telc', jobIds: [7] },
      ])

      const response = await loadAllWords(storageCache)

      expect(response).toHaveLength(lunesStandardVocabularyMock.length)
    })
  })
})
