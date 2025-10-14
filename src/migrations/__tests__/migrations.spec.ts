import AsyncStorage from '@react-native-async-storage/async-storage'

import { loadStorageCache, STORAGE_VERSION, storageKeys } from '../../services/Storage'
import { FAVORITES_KEY_VERSION_0 } from '../../services/storageUtils'

describe('migrations.spec.ts', () => {
  it('should migrate from old version', async () => {
    await AsyncStorage.setItem(storageKeys.version, '0')
    const storageCache = await loadStorageCache()
    expect(storageCache.getItem('version')).toBe(STORAGE_VERSION)
  })

  describe('migrate0To1', () => {
    it('Should migrate to new favorite storage', async () => {
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
})
