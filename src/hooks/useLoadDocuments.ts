import { ARTICLES } from '../constants/data'
import { DocumentType, ENDPOINTS } from '../constants/endpoints'
import { Discipline } from '../navigation/NavigationTypes'
import useLoadFromEndpoint, { getFromEndpoint, ReturnType } from './useLoadFromEndpoint'

export interface AlternativeWordTypeFromServer {
  article: number
  alt_word: string
}

export interface DocumentTypeFromServer {
  id: number
  word: string
  article: number
  document_image: Array<{ id: number; image: string }>
  audio: string
  alternatives: AlternativeWordTypeFromServer[]
}

const formatServerResponse = (documents: DocumentTypeFromServer[]): DocumentType[] =>
  documents.map(document => ({
    ...document,
    article: ARTICLES[document.article],
    alternatives: document.alternatives.map(it => ({
      article: ARTICLES[it.article],
      word: it.alt_word
    }))
  })) ?? []

export const loadDocuments = async (discipline: Discipline): Promise<DocumentType[]> => {
  const url = ENDPOINTS.documents.replace(':id', `${discipline.id}`)

  const response = await getFromEndpoint<DocumentTypeFromServer[]>(url, discipline.apiKey)
  return formatServerResponse(response)
}

const useLoadDocuments = (discipline: Discipline): ReturnType<DocumentType[]> =>
  useLoadFromEndpoint(async () => {
    return await loadDocuments(discipline)
  })

export default useLoadDocuments
