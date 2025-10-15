import AsyncStorage from '@react-native-async-storage/async-storage'

import { WordNodeCard } from '../../services/RepetitionService'
import { loadStorageCache, STORAGE_VERSION, storageKeys } from '../../services/Storage'
import { FAVORITES_KEY_VERSION_0 } from '../../services/storageUtils'

describe('migrations.spec.ts', () => {
  it('should migrate from old version', async () => {
    await AsyncStorage.setItem(storageKeys.version, '0')
    const storageCache = await loadStorageCache()
    expect(storageCache.getItem('version')).toBe(STORAGE_VERSION)
  })

  describe('migrate0To1', () => {
    it('should migrate to new favorite storage', async () => {
      // eslint-disable-next-line no-magic-numbers
      await AsyncStorage.setItem(FAVORITES_KEY_VERSION_0, JSON.stringify([42, 84]))
      await expect(AsyncStorage.getItem(FAVORITES_KEY_VERSION_0)).resolves.not.toBeNull()
      await AsyncStorage.setItem(storageKeys.selectedProfessions, '[]')
      const storageCache = await loadStorageCache()
      await expect(AsyncStorage.getItem(FAVORITES_KEY_VERSION_0)).resolves.toBeNull()
      expect(storageCache.getItem('favorites')).toEqual([
        { id: 42, vocabularyItemType: 'lunes-standard' },
        {
          id: 84,
          vocabularyItemType: 'lunes-standard',
        },
      ])
    })
  })

  describe('migrate1To2', () => {
    // {"wordNodeCards":[{"word":{"id":1,"word":"Hund","article":{"id":1,"value":"der"},"images":[{"id":0,"image":""}],"audio":null,"alternatives":[],"type":"user-created"},"section":0,"inThisSectionSince":"2025-10-13T00:02:35.103Z"},{"word":{"id":2,"word":"Testwort","article":{"id":3,"value":"das"},"images":[{"id":0,"image":""}],"audio":null,"alternatives":[],"type":"user-created"},"section":0,"inThisSectionSince":"2025-10-13T00:02:36.135Z"}],"isTrackingEnabled":true,"selectedProfessions":[],"isDevModeEnabled":false,"progress":{},"cmsUrlOverwrite":null,"customDisciplines":[],"userVocabulary":[{"id":1,"word":"Hund","article":{"id":1,"value":"der"},"images":[{"id":0,"image":""}],"audio":null,"alternatives":[],"type":"user-created"},{"id":2,"word":"Testwort","article":{"id":3,"value":"das"},"images":[{"id":0,"image":""}],"audio":null,"alternatives":[],"type":"user-created"}],"nextUserVocabularyId":3,"favorites":[{"id":1,"vocabularyItemType":"user-created"},{"id":2,"vocabularyItemType":"user-created"}]}
    it('should migrate to new wordNodeCards storage', async () => {
      await AsyncStorage.setItem('version', '1')
      await AsyncStorage.setItem(
        'wordNodeCards',
        JSON.stringify([
          {
            word: {
              id: 1,
              word: 'Hund',
              article: { id: 1, value: 'der' },
              images: [{ id: 0, image: 'image-0' }],
              audio: null,
              alternatives: [],
              type: 'user-created',
            },
            section: 0,
            inThisSectionSince: new Date('2025-10-13'),
          },
          {
            word: {
              id: 2,
              word: 'Testwort',
              article: { id: 3, value: 'das' },
              images: [{ id: 0, image: 'image-1' }],
              audio: null,
              alternatives: [],
              type: 'user-created',
            },
            section: 0,
            inThisSectionSince: new Date('2025-10-13'),
          },
        ]),
      )
      const storageCache = await loadStorageCache()

      const expectedWordNodeCards: WordNodeCard[] = [
        {
          wordRef: { type: 'user-created', id: 1 },
          section: 0,
          inThisSectionSince: new Date('2025-10-13'),
        },
        {
          wordRef: { type: 'user-created', id: 2 },
          section: 0,
          inThisSectionSince: new Date('2025-10-13'),
        },
      ]
      expect(storageCache.getItem('wordNodeCards')).toEqual(expectedWordNodeCards)
    })
  })
})
