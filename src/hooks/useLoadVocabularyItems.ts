import { ENDPOINTS } from '../constants/endpoints'
import { ARTICLES } from '../model/Article'
import VocabularyItem from '../model/VocabularyItem'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'

export type AlternativeWordFromServer = {
  article: number
  alt_word: string
}

export type VocabularyItemFromServer = {
  id: number
  word: string
  article: number
  document_image: Array<{ id: number; image: string }>
  audio: string
  alternatives: AlternativeWordFromServer[]
}

export const formatVocabularyItemFromServer = (vocabularyItemFromServer: VocabularyItemFromServer): VocabularyItem => ({
  id: vocabularyItemFromServer.id,
  word: vocabularyItemFromServer.word,
  audio: vocabularyItemFromServer.audio,
  type: 'lunes-standard',
  article: ARTICLES[vocabularyItemFromServer.article],
  images: vocabularyItemFromServer.document_image.map(({ image }) => image),
  alternatives: vocabularyItemFromServer.alternatives.map(it => ({
    article: ARTICLES[it.article],
    word: it.alt_word,
  })),
})

export const formatVocabularyItemsFromServer = (
  vocabularyItemFromServers: VocabularyItemFromServer[],
): VocabularyItem[] => vocabularyItemFromServers.map(item => formatVocabularyItemFromServer(item))

export const loadVocabularyItems = async ({ disciplineId }: { disciplineId: number }): Promise<VocabularyItem[]> => {
  const url = ENDPOINTS.vocabularyItems.replace(':id', `${disciplineId}`)
  const response = await getFromEndpoint<VocabularyItemFromServer[]>(url)
  return formatVocabularyItemsFromServer(response)
}

const useLoadVocabularyItems = ({
  disciplineId,
  apiKey,
}: {
  disciplineId: number
  apiKey?: string
}): Return<VocabularyItem[]> => useLoadAsync(loadVocabularyItems, { disciplineId, apiKey })

export default useLoadVocabularyItems
