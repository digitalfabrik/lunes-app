import { ARTICLES, VOCABULARY_ITEM_TYPES } from '../constants/data'
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

export const formatVocabularyItemFromServer = (
  vocabularyItemFromServer: VocabularyItemFromServer,
  apiKey?: string
): VocabularyItem => ({
  ...vocabularyItemFromServer,
  type: apiKey ? VOCABULARY_ITEM_TYPES.lunesProtected : VOCABULARY_ITEM_TYPES.lunesStandard,
  article: ARTICLES[vocabularyItemFromServer.article],
  image: vocabularyItemFromServer.document_image,
  alternatives: vocabularyItemFromServer.alternatives.map(it => ({
    article: ARTICLES[it.article],
    word: it.alt_word,
  })),
  apiKey,
})

export const formatVocabularyItemsFromServer = (
  vocabularyItemFromServers: VocabularyItemFromServer[],
  apiKey?: string
): VocabularyItem[] => vocabularyItemFromServers.map(item => formatVocabularyItemFromServer(item, apiKey))

export const loadVocabularyItems = async ({
  disciplineId,
  apiKey,
}: {
  disciplineId: number
  apiKey?: string
}): Promise<VocabularyItem[]> => {
  const url = ENDPOINTS.vocabularyItems.replace(':id', `${disciplineId}`)
  const response = await getFromEndpoint<VocabularyItemFromServer[]>(url, apiKey)
  return formatVocabularyItemsFromServer(response, apiKey)
}

const useLoadVocabularyItems = ({
  disciplineId,
  apiKey,
}: {
  disciplineId: number
  apiKey?: string
}): Return<VocabularyItem[]> => useLoadAsync(loadVocabularyItems, { disciplineId, apiKey })

export default useLoadVocabularyItems
