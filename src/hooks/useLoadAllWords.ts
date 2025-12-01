import { VocabularyItem } from '../constants/endpoints'
import { StorageCache } from '../services/Storage'
import { getUserVocabularyItems } from '../services/storageUtils'
import { loadAllVocabularyItems } from './useLoadAllVocabularyItems'
import { Return, useLoadAsync } from './useLoadAsync'
import { useStorageCache } from './useStorage'

export const loadAllWords = async (storageCache: StorageCache): Promise<VocabularyItem[]> => {
  const lunesStandardVocabulary = await loadAllVocabularyItems()
  const userVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary'))
  return [...lunesStandardVocabulary, ...userVocabulary]
}

const useLoadAllWords = (): Return<VocabularyItem[]> => useLoadAsync(loadAllWords, useStorageCache())

export default useLoadAllWords
