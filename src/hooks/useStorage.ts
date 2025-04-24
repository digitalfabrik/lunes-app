import { useCallback, useContext, useSyncExternalStore } from 'react'

import { Storage, StorageCache, StorageCacheContext } from '../services/Storage'

const useStorage = <T extends keyof Storage>(
  key: T,
): [Readonly<Storage[T]>, (newValue: Storage[T]) => Promise<void>] => {
  const storageCache = useContext(StorageCacheContext)
  const value = useSyncExternalStore(
    (listener: () => void) => storageCache.addListener(key, listener),
    () => storageCache.getItem(key),
  )
  const setValue = useCallback((newValue: Storage[T]) => storageCache.setItem(key, newValue), [storageCache, key])

  return [value, setValue]
}

export const useStorageCache = (): StorageCache => useContext(StorageCacheContext)

export default useStorage
