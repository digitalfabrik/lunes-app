import AsyncStorage from '@react-native-async-storage/async-storage'

import { getStorageItem, getStorageItemOr, STORAGE_VERSION, storageKeys } from '../services/Storage'
import { CMS_URLS } from '../services/axios'
import { FAVORITES_KEY_VERSION_0 } from '../services/storageUtils'

/// Migrates the old favorites storage to the new format with a vocabularyItemType field
export const migrate0To1 = async (): Promise<void> => {
  const parsedFavorites = await getStorageItemOr<number[]>(FAVORITES_KEY_VERSION_0, [])
  if (parsedFavorites.length === 0) {
    return
  }
  await AsyncStorage.setItem(
    'favorites-2',
    JSON.stringify(
      parsedFavorites.map((item: number) => ({
        id: item,
        vocabularyItemType: 'lunes-standard',
      })),
    ),
  )
  await AsyncStorage.removeItem(FAVORITES_KEY_VERSION_0)
}

// Removes the cms url overwrite value in case it has changed between versions
export const migrateApiEndpointUrl = async (): Promise<void> => {
  const overwrite = await AsyncStorage.getItem('cmsUrlOverwrite')
  if (overwrite !== null && !(CMS_URLS as readonly string[]).includes(overwrite)) {
    await AsyncStorage.removeItem(storageKeys.cmsUrlOverwrite)
  }
}

export const migrateStorage = async (): Promise<void> => {
  const getStorageVersion = async (): Promise<number> => {
    const version = await getStorageItemOr<number | null>(storageKeys.version, null)
    if (version !== null) {
      return version
    }

    // If there is no version number stored yet,
    // this is either a new installation or an update from a version where this field did not exist yet.
    // In the former case, the storage version should be the latest version to avoid unnecessary startup work.
    // In the latter case, we should use 0 as the version number so that all migrations.spec.ts are run.
    // To differentiate between the two cases, we can use the fact that `selectedProfessions` is null if and only if the startup screen was not completed yet.
    const selectedProfessions = await getStorageItem('selectedProfessions')
    return selectedProfessions === null ? STORAGE_VERSION : 0
  }

  const lastVersion = await getStorageVersion()
  switch (lastVersion) {
    case 0:
      await migrate0To1()
      break
  }

  if (__DEV__) {
    await migrateApiEndpointUrl()
  }

  if (lastVersion !== STORAGE_VERSION) {
    await AsyncStorage.setItem(storageKeys.version, STORAGE_VERSION.toString())
  }
}
