import { Favorite, VOCABULARY_ITEM_TYPES } from '../constants/data'
import VocabularyItem from '../models/VocabularyItem'
import { getWordById } from '../services/CmsApi'
import { StorageCache } from '../services/Storage'
import { getUserVocabularyItems, removeFavorite } from '../services/storageUtils'
import useLoadAsync, { Return } from './useLoadAsync'
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
  return getWordById(favorite.id)
}

const useLoadFavorite = (favorite: Favorite): Return<VocabularyItem | null> => {
  const storageCache = useStorageCache()
  return useLoadAsync(loadFavorite, { storageCache, favorite })
}

export default useLoadFavorite
