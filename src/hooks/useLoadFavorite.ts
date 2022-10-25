import { DOCUMENT_TYPES, Favorite } from '../constants/data'
import { VocabularyItem, ENDPOINTS } from '../constants/endpoints'
import { getUserVocabularyItems, removeFavorite } from '../services/AsyncStorage'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'
import { VocabularyItemFromServer, formatVocabularyItemFromServer } from './useLoadVocabularyItems'

export const loadFavorite = async (favorite: Favorite): Promise<VocabularyItem | null> => {
  if (favorite.documentType === DOCUMENT_TYPES.userCreated) {
    const userVocabulary = await getUserVocabularyItems()
    const userCreatedFavorite = userVocabulary.find(item => item.id === favorite.id)
    if (!userCreatedFavorite) {
      await removeFavorite(favorite)
      return null
    }
    return userCreatedFavorite
  }
  const url = `${ENDPOINTS.vocabularyItem}/${favorite.id}`
  const document = await getFromEndpoint<VocabularyItemFromServer>(url, favorite.apiKey)
  return formatVocabularyItemFromServer(document)
}

const useLoadFavorite = (favorite: Favorite): Return<Document | null> => useLoadAsync(loadFavorite, favorite)

export default useLoadFavorite
