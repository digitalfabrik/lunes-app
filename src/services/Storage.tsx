import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'

import { WordNodeCard } from './RepetitionService'
import { reportError } from './sentry'

export type StorageField<T> = {
  value: T
  set: (value: T) => Promise<void>
}

export type Storage = {
  wordNodeCards: StorageField<WordNodeCard[]>
}

class DefaultStorageField<T> {
  value: T

  constructor(value: T) {
    this.value = value
  }

  set = (value: T) => {
    this.value = value
    return Promise.resolve()
  }
}

/**
 * The default storage contains the default values that will be used if nothing else
 * is stored yet on the device.
 * It is also useful for testing, to mock the actual storage implementation.
 */
export const newDefaultStorage = (): Storage => ({
  wordNodeCards: new DefaultStorageField<WordNodeCard[]>([]),
})
const defaultStorage = newDefaultStorage()

export const StorageContext = createContext<Storage>(defaultStorage)

type StorageContextProviderProps = {
  children: ReactElement
}

// eslint-disable-next-line consistent-return
const getStorageKey = (key: keyof Storage): string => {
  switch (key) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    case 'wordNodeCards':
      return 'wordNodeCards'
  }
}

const getStorageItem = async <T,>(key: keyof Storage): Promise<T> => {
  const value = await AsyncStorage.getItem(getStorageKey(key))
  return value ? JSON.parse(value) : defaultStorage[key].value
}

const setStorageItem = async <T,>(key: keyof Storage, value: T): Promise<void> => {
  await AsyncStorage.setItem(getStorageKey(key), JSON.stringify(value))
}

/**
 * Represents the type of the value in the storage for the given key
 */
type StorageValue<T> = T extends keyof Storage ? Storage[T]['value'] : never

const useStorageField = <T extends keyof Storage>(key: T): StorageField<StorageValue<T>> | null => {
  const [value, setValue] = useState<StorageValue<T> | null>(null)

  useEffect(() => {
    getStorageItem<StorageValue<T>>(key)
      .then(value => setValue(value))
      .catch(reportError)
  }, [key])

  const updateValue = useCallback(
    async (newValue: StorageValue<T>) => {
      setValue(newValue)
      return setStorageItem(key, newValue).catch(reportError)
    },
    [key],
  )
  return useMemo(() => (value != null ? { value, set: updateValue } : null), [value, updateValue])
}

const StorageContextProvider = ({ children }: StorageContextProviderProps): ReactElement | null => {
  const wordNodeCards = useStorageField('wordNodeCards')

  const context = useMemo(() => (wordNodeCards !== null ? { wordNodeCards } : null), [wordNodeCards])

  if (context !== null) {
    return <StorageContext.Provider value={context}>{children}</StorageContext.Provider>
  }
  return null
}

export default StorageContextProvider
