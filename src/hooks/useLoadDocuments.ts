import { ARTICLES } from '../constants/data'
import { DocumentType, ENDPOINTS } from '../constants/endpoints'
import { Discipline } from '../navigation/NavigationTypes'
import useLoadFromEndpoint, { ReturnType } from './useLoadFromEndpoint'

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

const useLoadDocuments = (discipline: Discipline): ReturnType<DocumentType[]> => {
  const url = ENDPOINTS.documents.replace(':id', `${discipline.id}`)
  console.log('a:', discipline)
  console.log('b:', discipline.apiKey)
  const documents: ReturnType<DocumentTypeFromServer[]> = useLoadFromEndpoint(url, discipline.apiKey)
  return transformArticle(documents)
}

export default useLoadDocuments
