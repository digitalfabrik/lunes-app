import { Dispatch, SetStateAction } from 'react'
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage'

import { WordNodeCard } from './RepetitionService'

const instance = new MMKVLoader().initialize()

enum _StorageKey {
  WordNodeCards,
}

type StorageKeyLiteral = keyof typeof _StorageKey

type useStateReturn<T> = [value: T, setValue: Dispatch<SetStateAction<T>>]

const useStorage = <T>(key: StorageKeyLiteral, defaultValue?: T): useStateReturn<T> =>
  useMMKVStorage(key, instance, defaultValue)

export const useWordNodeCards = (): useStateReturn<WordNodeCard[]> => useStorage<WordNodeCard[]>('WordNodeCards', [])
