import { ARTICLES } from '../constants/data'
import { DocumentType, ENDPOINTS } from '../constants/endpoints'
import useLoadFromEndpoint, { ReturnType } from './useLoadFromEndpoint'
import { shuffleArray } from "../services/helpers";

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

const transformArticle = (documents: ReturnType<DocumentTypeFromServer[]>): ReturnType<DocumentType[]> => {
  const formattedDocuments: DocumentType[] =
    documents.data?.map(document => ({
      ...document,
      article: ARTICLES[document.article],
      alternatives: document.alternatives.map(it => ({
        article: ARTICLES[it.article],
        word: it.alt_word
      }))
    })) ?? []
  return { ...documents, data: formattedDocuments }
}

const useLoadDocuments = (trainingSetId: number): ReturnType<DocumentType[]> => {
  const url = ENDPOINTS.documents.replace(':id', `${trainingSetId}`)
  const documents: ReturnType<DocumentTypeFromServer[]> = useLoadFromEndpoint(url)
  return transformArticle(documents)
}

export const useLoadDocumentsRandomOrder = (trainingSetId: number): ReturnType<DocumentType[]> => {
  const documents: ReturnType<DocumentType[]> = useLoadDocuments(trainingSetId)
  if (!documents.data) {
    return documents
  }
  const shuffledDocuments = shuffleArray(documents.data)
  return { ...documents, data: shuffledDocuments }
}

export default useLoadDocuments
