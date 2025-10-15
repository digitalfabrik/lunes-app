import AsyncStorage from '@react-native-async-storage/async-storage'

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
    await storageCache.setItem('isTrackingEnabled', false)
    expect(listenerCalls).toBe(1)
    await storageCache.setItem('isDevModeEnabled', false)
    expect(listenerCalls).toBe(2)
    removeListener()
    await storageCache.setItem('isTrackingEnabled', true)
    expect(listenerCalls).toBe(2)
  })
})
