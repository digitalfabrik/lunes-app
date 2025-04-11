import { useContext } from 'react'

import { VocabularyItem } from '../constants/endpoints'
import { getUserVocabularyItems } from '../services/AsyncStorage'
import { StorageCache, StorageCacheContext } from '../services/Storage'
import { loadAllVocabularyItems } from './useLoadAllVocabularyItems'
import { Return, useLoadAsync } from './useLoadAsync'

export const getAllWords = async (storageCache: StorageCache): Promise<VocabularyItem[]> => {
  const lunesStandardVocabulary = await loadAllVocabularyItems()
  const userVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary'))
  return [...lunesStandardVocabulary, ...userVocabulary]
}

const useGetAllWords = (): Return<VocabularyItem[]> => useLoadAsync(getAllWords, useContext(StorageCacheContext))

export default useGetAllWords
