import VocabularyItem from '../models/VocabularyItem'
import { getWords } from '../services/CmsApi'
import { StorageCache } from '../services/Storage'
import { Return, useLoadAsync } from './useLoadAsync'
import { useStorageCache } from './useStorage'

export const loadAllWords = async (storageCache: StorageCache): Promise<VocabularyItem[]> => {
  const lunesStandardVocabulary = await getWords()
  const userVocabulary = storageCache.getItem('userVocabulary')
  return [...lunesStandardVocabulary, ...userVocabulary]
}

const useLoadAllWords = (): Return<VocabularyItem[]> => useLoadAsync(loadAllWords, useStorageCache())

export default useLoadAllWords
