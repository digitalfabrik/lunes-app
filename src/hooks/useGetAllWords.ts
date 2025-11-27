import VocabularyItem from '../models/VocabularyItem'
import { getWords } from '../services/CmsApi'
import { StorageCache } from '../services/Storage'
import { Return, useLoadAsync } from './useLoadAsync'
import { useStorageCache } from './useStorage'

export const getAllWords = async (storageCache: StorageCache): Promise<VocabularyItem[]> => {
  const lunesStandardVocabulary = await getWords()
  const userVocabulary = storageCache.getItem('userVocabulary')
  return [...lunesStandardVocabulary, ...userVocabulary]
}

const useGetAllWords = (): Return<VocabularyItem[]> => useLoadAsync(getAllWords, useStorageCache())

export default useGetAllWords
