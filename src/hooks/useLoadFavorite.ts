import { DOCUMENT_TYPES, Favorite } from '../constants/data'
import { Document, ENDPOINTS } from '../constants/endpoints'
import { getUserVocabulary, removeFavorite } from '../services/AsyncStorage'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'
import { DocumentFromServer, formatDocumentFromServer } from './useLoadDocuments'

export const loadFavorite = async (favorite: Favorite): Promise<Document | null> => {
  if (favorite.documentType === DOCUMENT_TYPES.userCreated) {
    const userVocabulary = await getUserVocabulary()
    const userCreatedFavorite = userVocabulary.find(item => item.id === favorite.id)
    if (!userCreatedFavorite) {
      await removeFavorite(favorite)
      return null
    }
    return userCreatedFavorite
  }
  const url = `${ENDPOINTS.document}/${favorite.id}`
  const document = await getFromEndpoint<DocumentFromServer>(url, favorite.apiKey)
  return formatDocumentFromServer(document)
}

const useLoadFavorite = (favorite: Favorite): Return<Document | null> => useLoadAsync(loadFavorite, favorite)

export default useLoadFavorite
