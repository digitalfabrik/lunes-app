import { VocabularyItem } from '../constants/endpoints'
import { getUserVocabularyItems } from '../services/AsyncStorage'
import { loadAllVocabularyItems } from './useLoadAllVocabularyItems'
import { Return, useLoadAsync } from './useLoadAsync'

export const getAllWords = async (): Promise<VocabularyItem[]> => {
  const lunesStandardVocabulary = loadAllVocabularyItems()
  const userVocabulary = getUserVocabularyItems()
  let response: VocabularyItem[] = []
  return Promise.all([lunesStandardVocabulary, userVocabulary]).then(values => {
    response = response.concat(values[0])
    response = response.concat(values[1])
    return response
  })
}

const useGetAllWords = (): Return<VocabularyItem[]> => useLoadAsync(getAllWords, {})

export default useGetAllWords
