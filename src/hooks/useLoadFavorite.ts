import { Favorite } from '../constants/data'
import VocabularyItem from '../model/VocabularyItem'
import { StorageCache } from '../services/Storage'
import { removeFavorite } from '../services/storageUtils'
import useLoadAsync, { Return } from './useLoadAsync'
import { getVocabularyItem } from './useLoadVocabularyItemRefs'
import { useStorageCache } from './useStorage'

type LoadFavoriteProps = { storageCache: StorageCache; favorite: Favorite }
export const loadFavorite = async ({ storageCache, favorite }: LoadFavoriteProps): Promise<VocabularyItem | null> => {
  const vocabularyItem = await getVocabularyItem(storageCache, favorite)
  if (favorite.type === 'user-created' && vocabularyItem === undefined) {
    await removeFavorite(storageCache, favorite)
    return null
  }
  return vocabularyItem ?? null
}

const useLoadFavorite = (favorite: Favorite): Return<VocabularyItem | null> => {
  const storageCache = useStorageCache()
  return useLoadAsync(loadFavorite, { storageCache, favorite })
}

export default useLoadFavorite
