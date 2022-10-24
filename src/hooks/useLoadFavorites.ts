import { Document, ENDPOINTS } from '../constants/endpoints'
import { getFavorites } from '../services/AsyncStorage'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'
import { DocumentFromServer, formatServerResponse } from './useLoadDocuments'

export const loadFavorites = async (): Promise<Document[]> => {
  const favoriteIds = await getFavorites()
  const documents = await Promise.all(
    favoriteIds.map(id => {
      const url = `${ENDPOINTS.document}/${id}`
      return getFromEndpoint<DocumentFromServer>(url)
    })
  )

  return formatServerResponse(documents)
}

const useLoadFavorites = (): Return<Document[]> => useLoadAsync(loadFavorites, {})

export default useLoadFavorites
