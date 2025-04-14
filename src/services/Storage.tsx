import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactElement } from 'react'

import { Favorite, Progress } from '../constants/data'
import { UserVocabularyItem } from '../constants/endpoints'
import useLoadAsync from '../hooks/useLoadAsync'
import { migrateToNewFavoriteFormat } from './AsyncStorage'
import { WordNodeCard } from './RepetitionService'
import { CMS } from './axios'

export type Storage = {
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

// eslint-disable-next-line consistent-return
const getStorageKey = (key: keyof Storage): string => {
  switch (key) {
    case 'wordNodeCards':
      return 'wordNodeCards'
    case 'isTrackingEnabled':
      return 'sentryTracking'
    case 'selectedProfessions':
      return 'selectedProfessions'
    case 'isDevModeEnabled':
      return 'devmode'
    case 'progress':
      return 'progress'
    case 'cmsUrlOverwrite':
      return 'cms'
    case 'customDisciplines':
      return 'customDisciplines'
    case 'userVocabulary':
      return 'userVocabulary'
    case 'nextUserVocabularyId':
      return 'userVocabularyNextId'
    case 'favorites':
      return 'favorites-2'
  }
}

export const getStorageItemOr = async <T,>(key: string, defaultValue: T): Promise<T> => {
  const value = await AsyncStorage.getItem(key)
  return value ? JSON.parse(value) : defaultValue
}

export const getStorageItem = async <T extends keyof Storage>(key: T): Promise<Storage[T]> =>
  getStorageItemOr(getStorageKey(key), defaultStorage[key])

const setStorageItem = async <T extends keyof Storage>(key: T, value: Storage[T]): Promise<void> => {
  await AsyncStorage.setItem(getStorageKey(key), JSON.stringify(value))
}

// https://github.com/react-native-async-storage/async-storage/issues/401#issuecomment-2508924008
export class StorageCache {
  private readonly listeners: Map<string, Set<() => void>> = new Map()
  private readonly storage: Storage

  private constructor(storage: Storage) {
    this.storage = storage
  }

  static createForTesting = (): StorageCache => new StorageCache(newDefaultStorage())

  static create = async (storage: Storage): Promise<StorageCache> => {
    const storageCache = new StorageCache(storage)
    await storageCache.migrate()
    return storageCache
  }

  migrate = async (): Promise<void> => {
    await migrateToNewFavoriteFormat(this)
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

export const StorageCacheContext = createContext<StorageCache>(StorageCache.createForTesting())

type StorageCacheContextProviderProps = {
  children: ReactElement
}

const resolveObject = async <T extends Record<keyof T, unknown>>(
  obj: T,
): Promise<{ [K in keyof T]: Awaited<T[K]> }> => {
  const entries = await Promise.all(Object.entries(obj).map(async ([k, v]) => [k, await v]))
  return Object.fromEntries(entries)
}

const loadStorageCache = async (): Promise<StorageCache> => {
  const storage: Storage = await resolveObject({
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
