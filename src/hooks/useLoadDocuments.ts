import { ARTICLES } from '../constants/data'
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

const formatServerResponse = (documents: DocumentFromServer[]): Document[] =>
  documents.map(document => ({
    ...document,
    article: ARTICLES[document.article],
    alternatives: document.alternatives.map(it => ({
      article: ARTICLES[it.article],
      word: it.alt_word
    }))
  }))

export const loadDocuments = async ({
  disciplineId,
  apiKey
}: {
  disciplineId: number
  apiKey?: string
}): Promise<Document[]> => {
  const url = ENDPOINTS.documents.replace(':id', `${disciplineId}`)
  const response = await getFromEndpoint<DocumentFromServer[]>(url, apiKey)
  return formatServerResponse(response)
}

const useLoadDocuments = ({ disciplineId, apiKey }: { disciplineId: number; apiKey?: string }): Return<Document[]> =>
  useLoadAsync(loadDocuments, { disciplineId, apiKey })

export default useLoadDocuments
