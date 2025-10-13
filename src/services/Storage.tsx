import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactElement } from 'react'

import { Favorite, Progress } from '../constants/data'
import { UserVocabularyItem } from '../constants/endpoints'
import useLoadAsync from '../hooks/useLoadAsync'
import { WordNodeCard } from './RepetitionService'
import { CMS } from './axios'
import { migrateStorage } from './storageUtils'

export const STORAGE_VERSION = 1

export type Storage = {
  // Goes from 1 to STORAGE_VERSION and is incremented for each new required migration.
  // 0 stands for the versions of the storage where no version number was stored yet.
  version: number
  wordNodeCards: WordNodeCard[]
  isTrackingEnabled: boolean
  // Null means the selected professions were never set before, which means that the intro should be shown
  selectedProfessions: number[] | null
  isDevModeEnabled: boolean
  progress: Progress
  cmsUrlOverwrite: CMS | null
  customDisciplines: string[]
  userVocabulary: UserVocabularyItem[]
  nextUserVocabularyId: number
  favorites: Favorite[]
}

/**
 * The default storage contains the default values that will be used if nothing else
 * is stored yet on the device.
 * It is also useful for testing, to mock the actual storage implementation.
 */
export const newDefaultStorage = (): Storage => ({
  version: STORAGE_VERSION,
  wordNodeCards: [],
  isTrackingEnabled: true,
  selectedProfessions: null,
  isDevModeEnabled: false,
  progress: {},
  cmsUrlOverwrite: null,
  customDisciplines: [],
  userVocabulary: [],
  nextUserVocabularyId: 1,
  favorites: [],
})
const defaultStorage = newDefaultStorage()

export const storageKeys: Record<keyof Storage, string> = {
  version: 'version',
  wordNodeCards: 'wordNodeCards',
  isTrackingEnabled: 'sentryTracking',
  selectedProfessions: 'selectedProfessions',
  isDevModeEnabled: 'devmode',
  progress: 'progress',
  cmsUrlOverwrite: 'cms',
  customDisciplines: 'customDisciplines',
  userVocabulary: 'userVocabulary',
  nextUserVocabularyId: 'userVocabularyNextId',
  favorites: 'favorites-2',
}

export const getStorageItemOr = async <T,>(key: string, defaultValue: T): Promise<T> => {
  const value = await AsyncStorage.getItem(key)
  return value ? JSON.parse(value) : defaultValue
}

export const getStorageItem = async <T extends keyof Storage>(key: T): Promise<Storage[T]> =>
  getStorageItemOr(storageKeys[key], defaultStorage[key])

const setStorageItem = async <T extends keyof Storage>(key: T, value: Storage[T]): Promise<void> => {
  await AsyncStorage.setItem(storageKeys[key], JSON.stringify(value))
}

// https://github.com/react-native-async-storage/async-storage/issues/401#issuecomment-2508924008
export class StorageCache {
  private readonly listeners: Map<string, Set<() => void>> = new Map()
  private readonly storage: Storage

  private constructor(storage: Storage) {
    this.storage = storage
  }

  static createDummy = (): StorageCache => new StorageCache(newDefaultStorage())

  static create = async (storage: Storage): Promise<StorageCache> => {
    const storageCache = new StorageCache(storage)
    await migrateStorage(storageCache)
    return storageCache
  }

  /**
   * Returns a storage item for the given key.
   * The item should be treated as immutable and may not be modified.
   *
   * @param key The key of the storage item
   */
  getItem = <T extends keyof Storage>(key: T): Readonly<Storage[T]> => this.storage[key]

  /**
   * Returns a storage item that may be modified
   *
   * @param key The key of the storage item
   */
  getMutableItem = <T extends keyof Storage>(key: T): Storage[T] => JSON.parse(JSON.stringify(this.getItem(key)))

  setItem = async <T extends keyof Storage>(key: T, value: Storage[T]): Promise<void> => {
    this.storage[key] = value
    await setStorageItem(key, value)
    this.notifyListeners(key)
  }

  addListener = <T extends keyof Storage>(key: T, listener: () => void): (() => void) => {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key)?.add(listener)

    return () => {
      this.listeners.get(key)?.delete(listener)
    }
  }

  private notifyListeners = (key: keyof Storage) => {
    this.listeners.get(key)?.forEach(listener => {
      listener()
    })
  }
}

export const StorageCacheContext = createContext<StorageCache>(StorageCache.createDummy())

type StorageCacheContextProviderProps = {
  children: ReactElement
}

const resolveObject = async <T extends Record<keyof T, unknown>>(
  object: T,
): Promise<{ [K in keyof T]: Awaited<T[K]> }> => {
  const entries = await Promise.all(Object.entries(object).map(async ([key, value]) => [key, await value]))
  return Object.fromEntries(entries)
}

export const loadStorageCache = async (): Promise<StorageCache> => {
  const getStorageVersion = async (): Promise<number> => {
    const version = await getStorageItemOr<number | null>(storageKeys.version, null)
    if (version !== null) {
      return version
    }

    // If there is no version number stored yet,
    // this is either a new installation or an update from a version where this field did not exist yet.
    // In the former case, the storage version should be the latest version to avoid unnecessary startup work.
    // In the latter case, we should use 0 as the version number so that all migrations are run.
    // To differentiate between the two cases, we can use the fact that `selectedProfessions` is null if and only if the startup screen was not completed yet.
    const selectedProfessions = await getStorageItem('selectedProfessions')
    return selectedProfessions === null ? STORAGE_VERSION : 0
  }

  const storage: Storage = await resolveObject({
    version: getStorageVersion(),
    wordNodeCards: getStorageItem('wordNodeCards'),
    isTrackingEnabled: getStorageItem('isTrackingEnabled'),
    selectedProfessions: getStorageItem('selectedProfessions'),
    isDevModeEnabled: getStorageItem('isDevModeEnabled'),
    progress: getStorageItem('progress'),
    cmsUrlOverwrite: getStorageItem('cmsUrlOverwrite'),
    customDisciplines: getStorageItem('customDisciplines'),
    userVocabulary: getStorageItem('userVocabulary'),
    nextUserVocabularyId: getStorageItem('nextUserVocabularyId'),
    favorites: getStorageItem('favorites'),
  })
  return StorageCache.create(storage)
}

const StorageContextProvider = ({ children }: StorageCacheContextProviderProps): ReactElement | null => {
  const { data: storageCache } = useLoadAsync(loadStorageCache, null)

  if (storageCache !== null) {
    return <StorageCacheContext.Provider value={storageCache}>{children}</StorageCacheContext.Provider>
  }
  return null
}

export default StorageContextProvider
