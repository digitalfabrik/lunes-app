import { VOCABULARY_ITEM_TYPES, Favorite } from '../constants/data'
import { VocabularyItem, ENDPOINTS } from '../constants/endpoints'
import { getUserVocabularyItems, removeFavorite } from '../services/AsyncStorage'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'
import { VocabularyItemFromServer, formatVocabularyItemFromServer } from './useLoadVocabularyItems'

export const loadFavorite = async (favorite: Favorite): Promise<VocabularyItem | null> => {
  if (favorite.vocabularyItemType === VOCABULARY_ITEM_TYPES.userCreated) {
    const userVocabulary = await getUserVocabularyItems()
    const userCreatedFavorite = userVocabulary.find(item => item.id === favorite.id)
    if (!userCreatedFavorite) {
      await removeFavorite(favorite)
      return null
    }
    return userCreatedFavorite
  }
  const url = `${ENDPOINTS.vocabularyItem}/${favorite.id}`
  const vocabularyItemFromServer = await getFromEndpoint<VocabularyItemFromServer>(url, favorite.apiKey)
  return formatVocabularyItemFromServer(vocabularyItemFromServer)
}

const useLoadFavorite = (favorite: Favorite): Return<VocabularyItem | null> => useLoadAsync(loadFavorite, favorite)

export default useLoadFavorite
