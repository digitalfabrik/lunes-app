import { ARTICLES } from '../constants/data'
import { VocabularyItem, ENDPOINTS } from '../constants/endpoints'
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
// TODO: auf API überprüfen
export const formatServerResponse = (documents: DocumentFromServer[]): VocabularyItem[] =>
  documents.map(document => ({
    ...document,
    article: ARTICLES[document.article],
    alternatives: document.alternatives.map(it => ({
      article: ARTICLES[it.article],
      word: it.alt_word,
    })),
  }))

export const loadDocuments = async ({
  disciplineId,
  apiKey,
}: {
  disciplineId: number
  apiKey?: string
}): Promise<VocabularyItem[]> => {
  const url = ENDPOINTS.documents.replace(':id', `${disciplineId}`)
  const response = await getFromEndpoint<DocumentFromServer[]>(url, apiKey)
  return formatServerResponse(response)
}

const useLoadDocuments = ({ disciplineId, apiKey }: { disciplineId: number; apiKey?: string }): Return<VocabularyItem[]> =>
  useLoadAsync(loadDocuments, { disciplineId, apiKey })

export default useLoadDocuments
