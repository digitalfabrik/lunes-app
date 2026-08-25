import AsyncStorage from '@react-native-async-storage/async-storage'

import { ARTICLES } from '../../constants/data'
import { UserVocabularyItem, VocabularyItemTypes } from '../../models/VocabularyItem'
import { getStorageItem, loadStorageCache, storageKeys } from '../Storage'

describe('Storage', () => {
  it('Should be able to load from async storage', async () => {
    await expect(getStorageItem('isDevModeEnabled')).resolves.toBeFalsy()
    const devModeKey = storageKeys.isDevModeEnabled
    await AsyncStorage.setItem(devModeKey, 'true')
    await expect(getStorageItem('isDevModeEnabled')).resolves.toBeTruthy()

    const storageCache = await loadStorageCache()
    expect(storageCache.getItem('isDevModeEnabled')).toBeTruthy()
  })

  it('Should persist storage item', async () => {
    const storageCache = await loadStorageCache()
    expect(storageCache.getItem('isDevModeEnabled')).toBeFalsy()
    await storageCache.setItem('isDevModeEnabled', true)
    expect(storageCache.getItem('isDevModeEnabled')).toBeTruthy()

    const newStorageCache = await loadStorageCache()
    expect(newStorageCache.getItem('isDevModeEnabled')).toBeTruthy()
  })

  it('Should call listeners', async () => {
    const storageCache = await loadStorageCache()
    let listenerCalls = 0
    const removeListener = storageCache.addListener('isDevModeEnabled', () => {
      listenerCalls += 1
    })
    expect(listenerCalls).toBe(0)
    await storageCache.setItem('isDevModeEnabled', true)
    expect(listenerCalls).toBe(1)
    await storageCache.setItem('analyticsConsent', null)
    expect(listenerCalls).toBe(1)
    await storageCache.setItem('isDevModeEnabled', false)
    expect(listenerCalls).toBe(2)
    removeListener()
    await storageCache.setItem('analyticsConsent', { consentGiven: true, consentDate: '2024-01-01' })
    expect(listenerCalls).toBe(2)
  })

  describe('userVocabulary', () => {
    const persistedItem = {
      id: { index: 1, type: VocabularyItemTypes.UserCreated },
      word: 'Hund',
      article: ARTICLES[1],
      images: ['image-1-0-2000.jpg', 'image-1-1-2000.jpg'],
      audio: 'audio-1.m4a',
      alternatives: [],
    }
    const loadedItem: UserVocabularyItem = {
      ...persistedItem,
      images: [
        'file://mock-document-directory-path/image-1-0-2000.jpg',
        'file://mock-document-directory-path/image-1-1-2000.jpg',
      ],
      audio: 'file://mock-document-directory-path/audio-1.m4a',
    }

    it('Should resolve file names of images and audio to uris when loading', async () => {
      await AsyncStorage.setItem(storageKeys.userVocabulary, JSON.stringify([persistedItem]))
      const storageCache = await loadStorageCache()
      expect(storageCache.getItem('userVocabulary')).toEqual([loadedItem])
    })

    it('Should persist only the file names of images and audio', async () => {
      const storageCache = await loadStorageCache()
      await storageCache.setItem('userVocabulary', [loadedItem])
      expect(storageCache.getItem('userVocabulary')).toEqual([loadedItem])
      await expect(AsyncStorage.getItem(storageKeys.userVocabulary)).resolves.toEqual(JSON.stringify([persistedItem]))

      const newStorageCache = await loadStorageCache()
      expect(newStorageCache.getItem('userVocabulary')).toEqual([loadedItem])
    })
  })
})
