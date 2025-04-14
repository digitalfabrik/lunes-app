import AsyncStorage from '@react-native-async-storage/async-storage'

import { getStorageItem, getStorageKey, loadStorageCache } from '../Storage'
import { FAVORITES_KEY_VERSION_0 } from '../storageUtils'

describe('Storage', () => {
  it('Should be able to load from async storage', async () => {
    await expect(getStorageItem('isDevModeEnabled')).resolves.toBeFalsy()
    const devModeKey = getStorageKey('isDevModeEnabled')
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
    await storageCache.setItem('isTrackingEnabled', false)
    expect(listenerCalls).toBe(1)
    await storageCache.setItem('isDevModeEnabled', false)
    expect(listenerCalls).toBe(2)
    removeListener()
    await storageCache.setItem('isTrackingEnabled', true)
    expect(listenerCalls).toBe(2)
  })

  describe('migrations', () => {
    it('Should migrate to new favorite storage', async () => {
      await AsyncStorage.setItem(FAVORITES_KEY_VERSION_0, JSON.stringify([42, 84]))
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
})
