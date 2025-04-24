import { Favorite, VOCABULARY_ITEM_TYPES } from '../constants/data'
import { ENDPOINTS, VocabularyItem } from '../constants/endpoints'
import { StorageCache } from '../services/Storage'
import { getFromEndpoint } from '../services/axios'
import { getUserVocabularyItems, removeFavorite } from '../services/storageUtils'
import useLoadAsync, { Return } from './useLoadAsync'
import { formatVocabularyItemFromServer, VocabularyItemFromServer } from './useLoadVocabularyItems'
import { useStorageCache } from './useStorage'

type LoadFavoriteProps = { storageCache: StorageCache; favorite: Favorite }
export const loadFavorite = async ({ storageCache, favorite }: LoadFavoriteProps): Promise<VocabularyItem | null> => {
  if (favorite.vocabularyItemType === VOCABULARY_ITEM_TYPES.userCreated) {
    const userVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary'))
    const userCreatedFavorite = userVocabulary.find(item => item.id === favorite.id)
    if (!userCreatedFavorite) {
      await removeFavorite(storageCache, favorite)
      return null
    }
    return userCreatedFavorite
  }
  const url = `${ENDPOINTS.vocabularyItem}/${favorite.id}`
  const vocabularyItemFromServer = await getFromEndpoint<VocabularyItemFromServer>(url, favorite.apiKey)
  return formatVocabularyItemFromServer(vocabularyItemFromServer)
}

const useLoadFavorite = (favorite: Favorite): Return<VocabularyItem | null> => {
  const storageCache = useStorageCache()
  return useLoadAsync(loadFavorite, { storageCache, favorite })
}

export default useLoadFavorite
