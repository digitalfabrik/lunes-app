import { VocabularyItem, ENDPOINTS } from '../constants/endpoints'
import { getFavorites } from '../services/AsyncStorage'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'
import { VocabularyItemFromServer, formatServerResponse } from './useLoadDocuments'

export const loadFavorites = async (): Promise<VocabularyItem[]> => {
  const favoriteIds = await getFavorites()
  const vocabularyItemsFromServer = await Promise.all(
    favoriteIds.map(id => {
      const url = `${ENDPOINTS.vocabularyItem}/${id}`
      return getFromEndpoint<VocabularyItemFromServer>(url)
    })
  )

  return formatServerResponse(vocabularyItemsFromServer)
}

const useLoadFavorites = (): Return<VocabularyItem[]> => useLoadAsync(loadFavorites, {})

export default useLoadFavorites
