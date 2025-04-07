import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactElement, useMemo } from 'react'

import useLoadAsync from '../hooks/useLoadAsync'
import { WordNodeCard } from './RepetitionService'

export type Storage = {
  wordNodeCards: WordNodeCard[]
  isTrackingEnabled: boolean
  // Null means the selected professions were never set before, which means that the intro should be shown
  selectedProfessions: number[] | null
  isDevModeEnabled: boolean
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
  }
}

export const getStorageItem = async <T extends keyof Storage>(key: T): Promise<Storage[T]> => {
  const value = await AsyncStorage.getItem(getStorageKey(key))
  return value ? JSON.parse(value) : defaultStorage[key]
}

const setStorageItem = async <T extends keyof Storage>(key: T, value: Storage[T]): Promise<void> => {
  await AsyncStorage.setItem(getStorageKey(key), JSON.stringify(value))
}

// https://github.com/react-native-async-storage/async-storage/issues/401#issuecomment-2508924008
export class StorageCache {
  private readonly listeners: Map<string, Set<() => void>> = new Map()
  private readonly storage: Storage

  constructor(storage: Storage) {
    this.storage = storage
  }

  getItem = <T extends keyof Storage>(key: T): Storage[T] => this.storage[key]

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

export const StorageCacheContext = createContext<StorageCache>(new StorageCache(newDefaultStorage()))

type StorageCacheContextProviderProps = {
  children: ReactElement
}

const resolveObject = async <T extends Record<keyof T, unknown>>(
  obj: T,
): Promise<{ [K in keyof T]: Awaited<T[K]> }> => {
  const entries = await Promise.all(Object.entries(obj).map(async ([k, v]) => [k, await v]))
  return Object.fromEntries(entries)
}

const loadStorage = async (): Promise<Storage> =>
  resolveObject({
    wordNodeCards: getStorageItem('wordNodeCards'),
    isTrackingEnabled: getStorageItem('isTrackingEnabled'),
    selectedProfessions: getStorageItem('selectedProfessions'),
    isDevModeEnabled: getStorageItem('isDevModeEnabled'),
  })

const StorageContextProvider = ({ children }: StorageCacheContextProviderProps): ReactElement | null => {
  const { data } = useLoadAsync(loadStorage, null)
  const storageCache = useMemo(() => (data != null ? new StorageCache(data) : null), [data])

  if (storageCache !== null) {
    return <StorageCacheContext.Provider value={storageCache}>{children}</StorageCacheContext.Provider>
  }
  return null
}

export default StorageContextProvider
