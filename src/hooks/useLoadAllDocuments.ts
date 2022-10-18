import { Document, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { Return, useLoadAsync } from './useLoadAsync'
import { DocumentFromServer, formatDocumentsFromServer } from './useLoadDocuments'

export const loadAllDocuments = async (): Promise<Document[]> => {
  const response = await getFromEndpoint<DocumentFromServer[]>(ENDPOINTS.document)
  return formatDocumentsFromServer(response)
}

const useLoadAllDocuments = (): Return<Document[]> => useLoadAsync(loadAllDocuments, {})

export default useLoadAllDocuments
