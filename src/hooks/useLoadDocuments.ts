import { ARTICLES } from '../constants/data'
import { VocabularyItem, ENDPOINTS } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'

export interface AlternativeWordFromServer {
  article: number
  alt_word: string
}

export interface VocabularyItemFromServer {
  id: number
  word: string
  article: number
  document_image: Array<{ id: number; image: string }>
  audio: string
  alternatives: AlternativeWordFromServer[]
}

export const formatServerResponse = (vocabularyItemsFromServer: VocabularyItemFromServer[]): VocabularyItem[] =>
  vocabularyItemsFromServer.map(item => ({
    ...item,
    article: ARTICLES[item.article],
    alternatives: item.alternatives.map(it => ({
      article: ARTICLES[it.article],
      word: it.alt_word,
    })),
  }))

export const loadVocabularyItems = async ({
  disciplineId,
  apiKey,
}: {
  disciplineId: number
  apiKey?: string
}): Promise<VocabularyItem[]> => {
  const url = ENDPOINTS.vocabularyItems.replace(':id', `${disciplineId}`)
  const response = await getFromEndpoint<VocabularyItemFromServer[]>(url, apiKey)
  return formatServerResponse(response)
}

const useLoadDocuments = ({ disciplineId, apiKey }: { disciplineId: number; apiKey?: string }): Return<VocabularyItem[]> =>
  useLoadAsync(loadVocabularyItems, { disciplineId, apiKey })

export default useLoadDocuments
