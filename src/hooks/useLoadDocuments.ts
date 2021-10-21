import { ARTICLES } from '../constants/data'
import { DocumentType, ENDPOINTS } from '../constants/endpoints'
import { DisciplineData } from '../navigation/NavigationTypes'
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

const useLoadDocuments = (discipline: DisciplineData): ReturnType<DocumentType[]> => {
  const url = ENDPOINTS.documents.replace(':id', `${discipline.id}`)
  const documents: ReturnType<DocumentTypeFromServer[]> = useLoadFromEndpoint(url, discipline.apiKeyOfCustomDiscipline)
  return transformArticle(documents)
}

export default useLoadDocuments
