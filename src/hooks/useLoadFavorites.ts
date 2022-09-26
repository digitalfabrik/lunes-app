import { VocabularyItem, ENDPOINTS } from '../constants/endpoints'
import AsyncStorage from '../services/AsyncStorage'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'
import { DocumentFromServer, formatServerResponse } from './useLoadDocuments'

export const loadFavorites = async (): Promise<VocabularyItem[]> => {
  const favoriteIds = await AsyncStorage.getFavorites()
  const documents = await Promise.all(
    favoriteIds.map(id => {
      const url = `${ENDPOINTS.document}/${id}`
      return getFromEndpoint<DocumentFromServer>(url)
    })
  )

  return formatServerResponse(documents)
}

const useLoadFavorites = (): Return<VocabularyItem[]> => useLoadAsync(loadFavorites, {})

export default useLoadFavorites
