import { mocked } from 'jest-mock'

import { StandardVocabularyItem, UserVocabularyItem } from '../../models/VocabularyItem'
import { getWords } from '../../services/CmsApi'
import { StorageCache } from '../../services/Storage'
import { reportError } from '../../services/sentry'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { loadAllWords } from '../useLoadAllWords'

jest.mock('../../services/CmsApi')
jest.mock('../../services/sentry')

describe('useLoadAllWords', () => {
  const lunesStandardVocabularyMock: StandardVocabularyItem[] = new VocabularyItemBuilder(3).build()
  const userVocabularyMock: UserVocabularyItem[] = [new VocabularyItemBuilder(4).buildUserVocabulary()[3]!]

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
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

  describe('when a contentArea was redeemed', () => {
    const telc = { id: 1, token: 'telc_token', name: 'telc gGmbH' }
    const contentAreaVocabularyMock: StandardVocabularyItem[] = new VocabularyItemBuilder(2)
      .build()
      .map((item, index) => ({ ...item, id: { ...item.id, id: 100 + index }, token: telc.token }))

    const mockPublicAndContentAreaWords = () =>
      mocked(getWords).mockImplementation(async token =>
        token === undefined ? lunesStandardVocabularyMock : contentAreaVocabularyMock,
      )

    it('should request the words of every redeemed contentArea and append them', async () => {
      mockPublicAndContentAreaWords()
      await storageCache.setItem('userVocabulary', [])
      await storageCache.setItem('contentAreas', [telc])

      const response = await loadAllWords(storageCache)

      expect(getWords).toHaveBeenCalledWith(telc.token)
      expect(response).toHaveLength(lunesStandardVocabularyMock.length + contentAreaVocabularyMock.length)
    })

    it('should not return a word twice if two contentAreas cover it', async () => {
      mockPublicAndContentAreaWords()
      await storageCache.setItem('userVocabulary', [])
      await storageCache.setItem('contentAreas', [telc, { ...telc, token: 'other_token', name: 'Other' }])

      const response = await loadAllWords(storageCache)

      expect(response).toHaveLength(lunesStandardVocabularyMock.length + contentAreaVocabularyMock.length)
    })

    it('should keep the public and the user vocabulary if the token of a contentArea is rejected', async () => {
      mocked(getWords).mockImplementation(async token => {
        if (token !== undefined) {
          throw new Error('unauthorized')
        }
        return lunesStandardVocabularyMock
      })
      await storageCache.setItem('userVocabulary', userVocabularyMock)
      await storageCache.setItem('contentAreas', [telc])

      const response = await loadAllWords(storageCache)

      expect(response).toHaveLength(lunesStandardVocabularyMock.length + userVocabularyMock.length)
      expect(reportError).toHaveBeenCalled()
    })
  })
})
