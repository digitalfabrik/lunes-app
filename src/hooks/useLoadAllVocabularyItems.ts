import { ENDPOINTS } from '../constants/endpoints'
import VocabularyItem from '../model/VocabularyItem'
import { getFromEndpoint } from '../services/axios'
import { Return, useLoadAsync } from './useLoadAsync'
import { VocabularyItemFromServer, formatVocabularyItemsFromServer } from './useLoadVocabularyItems'

export const loadAllVocabularyItems = async (): Promise<VocabularyItem[]> => {
  const response = await getFromEndpoint<VocabularyItemFromServer[]>(ENDPOINTS.vocabularyItem)
  return formatVocabularyItemsFromServer(response)
}

const useLoadAllVocabularyItems = (): Return<VocabularyItem[]> => useLoadAsync(loadAllVocabularyItems, {})

export default useLoadAllVocabularyItems
