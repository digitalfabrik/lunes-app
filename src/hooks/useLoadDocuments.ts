import { ARTICLES, DOCUMENT_TYPES } from '../constants/data'
import { Document, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'

export interface AlternativeWordFromServer {
  article: number
  alt_word: string
}

export interface DocumentFromServer {
  id: number
  word: string
  article: number
  document_image: Array<{ id: number; image: string }>
  audio: string
  alternatives: AlternativeWordFromServer[]
}

export const formatDocumentFromServer = (document: DocumentFromServer, apiKey?: string): Document => ({
  ...document,
  documentType: apiKey ? DOCUMENT_TYPES.lunesProtected : DOCUMENT_TYPES.lunesStandard,
  article: ARTICLES[document.article],
  alternatives: document.alternatives.map(it => ({
    article: ARTICLES[it.article],
    word: it.alt_word,
  })),
  apiKey,
})

export const formatDocumentsFromServer = (documents: DocumentFromServer[], apiKey?: string): Document[] =>
  documents.map(document => formatDocumentFromServer(document, apiKey))

export const loadDocuments = async ({
  disciplineId,
  apiKey,
}: {
  disciplineId: number
  apiKey?: string
}): Promise<Document[]> => {
  const url = ENDPOINTS.documents.replace(':id', `${disciplineId}`)
  const response = await getFromEndpoint<DocumentFromServer[]>(url, apiKey)
  return formatDocumentsFromServer(response, apiKey)
}

const useLoadDocuments = ({ disciplineId, apiKey }: { disciplineId: number; apiKey?: string }): Return<Document[]> =>
  useLoadAsync(loadDocuments, { disciplineId, apiKey })

export default useLoadDocuments
