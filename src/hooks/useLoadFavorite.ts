import { useCallback, useContext } from 'react'

import { Favorite, VOCABULARY_ITEM_TYPES } from '../constants/data'
import { ENDPOINTS, VocabularyItem } from '../constants/endpoints'
import { getUserVocabularyItems, removeFavorite } from '../services/AsyncStorage'
import { StorageCache, StorageCacheContext } from '../services/Storage'
import { getFromEndpoint } from '../services/axios'
import useLoadAsync, { Return } from './useLoadAsync'
import { formatVocabularyItemFromServer, VocabularyItemFromServer } from './useLoadVocabularyItems'

export const loadFavorite = async (storageCache: StorageCache, favorite: Favorite): Promise<VocabularyItem | null> => {
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
  const storageCache = useContext(StorageCacheContext)
  return useLoadAsync(
    useCallback(() => loadFavorite(storageCache, favorite), [storageCache, favorite]),
    null,
  )
}

export default useLoadFavorite
