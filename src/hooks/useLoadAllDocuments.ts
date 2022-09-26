import { VocabularyItem, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { Return, useLoadAsync } from './useLoadAsync'
import { DocumentFromServer, formatServerResponse } from './useLoadDocuments'

export const loadAllDocuments = async (): Promise<VocabularyItem[]> => {
  const response = await getFromEndpoint<DocumentFromServer[]>(ENDPOINTS.document)
  return formatServerResponse(response)
}

const useLoadAllDocuments = (): Return<VocabularyItem[]> => useLoadAsync(loadAllDocuments, {})

export default useLoadAllDocuments
