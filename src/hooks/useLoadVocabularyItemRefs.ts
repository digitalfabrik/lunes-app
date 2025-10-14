import VocabularyItem from '../model/VocabularyItem'
import VocabularyItemRef from '../model/VocabularyItemRef'
import { getWordByRef } from '../services/CmsApi'
import { StorageCache } from '../services/Storage'
import { getUserVocabularyItemByRef } from '../services/storageUtils'
import { Return, useLoadAsync } from './useLoadAsync'
import { useStorageCache } from './useStorage'

export const getVocabularyItem = async (
  storageCache: StorageCache,
  vocabularyItemRef: VocabularyItemRef,
  // eslint-disable-next-line consistent-return
): Promise<VocabularyItem | undefined> => {
  switch (vocabularyItemRef.type) {
    case 'lunes-standard':
      return getWordByRef(vocabularyItemRef)
    case 'user-created':
      return getUserVocabularyItemByRef(storageCache, vocabularyItemRef)
  }
}

export const getVocabularyItems = async ({
  storageCache,
  vocabularyItemRefs,
}: {
  storageCache: StorageCache
  vocabularyItemRefs: VocabularyItemRef[]
}): Promise<VocabularyItem[]> => {
  const vocabularyItems = await Promise.all(vocabularyItemRefs.map(ref => getVocabularyItem(storageCache, ref)))
  return vocabularyItems.filter(item => item !== undefined)
}

const useLoadVocabularyItemRefs = (refs: VocabularyItemRef[]): Return<VocabularyItem[]> =>
  useLoadAsync(getVocabularyItems, { storageCache: useStorageCache(), vocabularyItemRefs: refs })

export default useLoadVocabularyItemRefs
