import { ARTICLES } from '../constants/data'
import { Discipline, Document, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { shuffleArray } from '../services/helpers'
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

export const loadDocuments = async (discipline: Discipline): Promise<Document[]> => {
  const url = ENDPOINTS.documents.replace(':id', `${discipline.id}`)

  const response = await getFromEndpoint<DocumentFromServer[]>(url, discipline.apiKey)
  return formatServerResponse(response)
}

const useLoadDocuments = (discipline: Discipline, shuffle = false): Return<Document[]> => {
  const documents = useLoadAsync(loadDocuments, discipline)
  if (shuffle && documents.data) {
    shuffleArray(documents.data)
  }
  return documents
}

export default useLoadDocuments
