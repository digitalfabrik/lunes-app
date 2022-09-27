import { VocabularyItem, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { Return, useLoadAsync } from './useLoadAsync'
import { VocabularyItemFromServer, formatServerResponse } from './useLoadDocuments'

export const loadAllDocuments = async (): Promise<VocabularyItem[]> => {
  const response = await getFromEndpoint<VocabularyItemFromServer[]>(ENDPOINTS.document)
  return formatServerResponse(response)
}

const useLoadAllDocuments = (): Return<VocabularyItem[]> => useLoadAsync(loadAllDocuments, {})

export default useLoadAllDocuments
