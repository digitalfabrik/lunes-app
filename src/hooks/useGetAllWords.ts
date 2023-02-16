import { VocabularyItem } from '../constants/endpoints'
import { getUserVocabularyItems } from '../services/AsyncStorage'
import { loadAllVocabularyItems } from './useLoadAllVocabularyItems'
import { Return, useLoadAsync } from './useLoadAsync'

export const getAllWords = async (): Promise<VocabularyItem[]> => {
  const lunesStandardVocabulary = loadAllVocabularyItems()
  const userVocabulary = getUserVocabularyItems()
  return Promise.all([lunesStandardVocabulary, userVocabulary]).then(values => [...values[0], ...values[1]])
}

const useGetAllWords = (): Return<VocabularyItem[]> => useLoadAsync(getAllWords, {})

export default useGetAllWords
