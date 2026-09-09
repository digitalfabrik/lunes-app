import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactElement } from 'react'

import { Favorite, Progress, VocabularyNote } from '../constants/data'
import useLoadAsync from '../hooks/useLoadAsync'
import { UserVocabularyItem } from '../models/VocabularyItem'
import { AnalyticsConsent } from './AnalyticsService'
import { WordNodeCard } from './RepetitionService'
import { CMS } from './axios'
import { migrateStorage } from './storageUtils'

export const STORAGE_VERSION = 7

export type Storage = {
  // Goes from 1 to STORAGE_VERSION and is incremented for each new required migration.
  // 0 stands for the versions of the storage where no version number was stored yet.
  version: number
  wordNodeCards: WordNodeCard[]
  analyticsConsent: AnalyticsConsent | null
  // Null means the selected jobs were never set before, which means that the intro should be shown
  selectedJobs: number[] | null
  isDevModeEnabled: boolean
  progress: Progress
  cmsUrlOverwrite: CMS | null
  // Unused, old feature
  // TODO: fully delete if we decide that this is not needed anymore
  customDisciplines: string[]
  userVocabulary: UserVocabularyItem[]
  nextUserVocabularyId: number
  favorites: Favorite[]
  // Personal notes on vocabulary items, only ever stored on the device
  vocabularyNotes: VocabularyNote[]
  // Jobs that were started before the CMS migration and may have lost progress
  notMigratedSelectedJobs: number[]
  // A unique identifier for the installation
  installationId: string | null
}

/**
 * The default storage contains the default values that will be used if nothing else
 * is stored yet on the device.
 * It is also useful for testing, to mock the actual storage implementation.
 */
export const newDefaultStorage = (): Storage => ({
  version: STORAGE_VERSION,
  wordNodeCards: [],
  analyticsConsent: null,
  selectedJobs: null,
  isDevModeEnabled: false,
  progress: {},
  cmsUrlOverwrite: null,
  customDisciplines: [],
  userVocabulary: [],
  nextUserVocabularyId: 1,
  favorites: [],
  vocabularyNotes: [],
  notMigratedSelectedJobs: [],
  installationId: null,
})
const defaultStorage = newDefaultStorage()

type StorageKey = keyof Storage

export const storageKeys: Record<StorageKey, string> = {
  version: 'version',
  wordNodeCards: 'wordNodeCards',
  analyticsConsent: 'analyticsConsent',
  selectedJobs: 'selectedProfessions',
  isDevModeEnabled: 'devmode',
  progress: 'progress',
  cmsUrlOverwrite: 'cms',
  customDisciplines: 'customDisciplines',
  userVocabulary: 'userVocabulary',
  nextUserVocabularyId: 'userVocabularyNextId',
  favorites: 'favorites-2',
  vocabularyNotes: 'vocabularyNotes',
  notMigratedSelectedJobs: 'notMigratedSelectedJobs',
  installationId: 'installationId',
}

export type StorageValue = (typeof storageKeys)[keyof typeof storageKeys]

export const getFileName = (path: string): string => path.substring(path.lastIndexOf('/') + 1)

// Images and audio recordings of user vocabulary items are stored in the document directory of the app.
// Its absolute path may change between app updates (e.g. on iOS), therefore only the file names are persisted
// and resolved to absolute uris when loading the storage.
// See https://github.com/digitalfabrik/lunes-app/issues/1099
export const getUserVocabularyFileUri = (fileName: string): string => `file://${DocumentDirectoryPath}/${fileName}`

const mapUserVocabularyFiles = (
  userVocabulary: UserVocabularyItem[],
  mapFile: (file: string) => string,
): UserVocabularyItem[] =>
  userVocabulary.map(item => ({
    ...item,
    images: item.images.map(mapFile),
    audio: item.audio ? mapFile(item.audio) : null,
  }))

type StorageSerializer<T extends StorageKey> = {
  // Converts the value of the storage cache to the persisted value
  serialize: (value: Storage[T]) => Storage[T]
  // Converts the persisted value to the value of the storage cache
  deserialize: (value: Storage[T]) => Storage[T]
}

const storageSerializers: { [T in StorageKey]?: StorageSerializer<T> } = {
  userVocabulary: {
    serialize: userVocabulary => mapUserVocabularyFiles(userVocabulary, getFileName),
    deserialize: userVocabulary => mapUserVocabularyFiles(userVocabulary, getUserVocabularyFileUri),
  },
}

export const getStorageItemOr = async <T,>(key: StorageValue, defaultValue: T): Promise<T> => {
  const value = await AsyncStorage.getItem(key)
  return value ? JSON.parse(value) : defaultValue
}

export const getStorageItem = async <T extends StorageKey>(key: T): Promise<Storage[T]> => {
  const value = await getStorageItemOr(storageKeys[key], defaultStorage[key])
  const serializer = storageSerializers[key]
  return serializer ? serializer.deserialize(value) : value
}

const setStorageItem = async <T extends StorageKey>(key: T, value: Storage[T]): Promise<void> => {
  const serializer = storageSerializers[key]
  await AsyncStorage.setItem(storageKeys[key], JSON.stringify(serializer ? serializer.serialize(value) : value))
}

// https://github.com/react-native-async-storage/async-storage/issues/401#issuecomment-2508924008
export class StorageCache {
  private readonly listeners: Map<string, Set<() => void>> = new Map()
  private readonly storage: Storage

  private constructor(storage: Storage) {
    this.storage = storage
  }

  static createDummy = (): StorageCache => new StorageCache(newDefaultStorage())

  static create = async (storage: Storage): Promise<StorageCache> => new StorageCache(storage)

  /**
   * Returns a storage item for the given key.
   * The item should be treated as immutable and may not be modified.
   *
   * @param key The key of the storage item
   */
  getItem = <T extends StorageKey>(key: T): Readonly<Storage[T]> => this.storage[key]

  /**
   * Returns a storage item that may be modified
   *
   * @param key The key of the storage item
   */
  getMutableItem = <T extends StorageKey>(key: T): Storage[T] => JSON.parse(JSON.stringify(this.getItem(key)))

  setItem = async <T extends StorageKey>(key: T, value: Storage[T]): Promise<void> => {
    this.storage[key] = value
    await setStorageItem(key, value)
    this.notifyListeners(key)
  }

  addListener = <T extends StorageKey>(key: T, listener: () => void): (() => void) => {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key)?.add(listener)

    return () => {
      this.listeners.get(key)?.delete(listener)
    }
  }

  private notifyListeners = (key: StorageKey) => {
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
  await migrateStorage()

  const storage: Storage = await resolveObject({
    version: getStorageItem('version'),
    wordNodeCards: getStorageItem('wordNodeCards'),
    analyticsConsent: getStorageItem('analyticsConsent'),
    selectedJobs: getStorageItem('selectedJobs'),
    isDevModeEnabled: getStorageItem('isDevModeEnabled'),
    progress: getStorageItem('progress'),
    cmsUrlOverwrite: getStorageItem('cmsUrlOverwrite'),
    customDisciplines: getStorageItem('customDisciplines'),
    userVocabulary: getStorageItem('userVocabulary'),
    nextUserVocabularyId: getStorageItem('nextUserVocabularyId'),
    favorites: getStorageItem('favorites'),
    vocabularyNotes: getStorageItem('vocabularyNotes'),
    notMigratedSelectedJobs: getStorageItem('notMigratedSelectedJobs'),
    installationId: getStorageItem('installationId'),
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
