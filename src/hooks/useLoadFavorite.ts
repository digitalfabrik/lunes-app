import { Favorite } from '../constants/data'
import VocabularyItem, { areVocabularyItemIdsEqual, VocabularyItemTypes } from '../models/VocabularyItem'
import { getWordById } from '../services/CmsApi'
import { StorageCache } from '../services/Storage'
import { removeFavorite } from '../services/storageUtils'
import useLoadAsync, { Return } from './useLoadAsync'
import { useStorageCache } from './useStorage'

type LoadFavoriteProps = { storageCache: StorageCache; favorite: Favorite }
export const loadFavorite = async ({ storageCache, favorite }: LoadFavoriteProps): Promise<VocabularyItem | null> => {
  if (favorite.type === VocabularyItemTypes.UserCreated) {
    const userVocabulary = storageCache.getItem('userVocabulary')
    const userCreatedFavorite = userVocabulary.find(item => areVocabularyItemIdsEqual(item.id, favorite))
    if (!userCreatedFavorite) {
      await removeFavorite(storageCache, favorite)
      return null
    }
    return userCreatedFavorite
  }
  return getWordById(favorite)
}

const useLoadFavorite = (favorite: Favorite): Return<VocabularyItem | null> => {
  const storageCache = useStorageCache()
  return useLoadAsync(loadFavorite, { storageCache, favorite })
}

export default useLoadFavorite
