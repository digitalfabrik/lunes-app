import VocabularyItem, { serializeVocabularyItemId } from '../models/VocabularyItem'
import { getWords, getWordsForKey } from '../services/CmsApi'
import { StorageCache } from '../services/Storage'
import { Return, useLoadAsync } from './useLoadAsync'
import { useStorageCache } from './useStorage'

const withoutDuplicates = (vocabularyItems: VocabularyItem[]): VocabularyItem[] => {
  const seenIds = new Set<string>()
  return vocabularyItems.filter(item => {
    const id = serializeVocabularyItemId(item.id)
    if (seenIds.has(id)) {
      return false
    }
    seenIds.add(id)
    return true
  })
}

export const loadAllWords = async (storageCache: StorageCache): Promise<VocabularyItem[]> => {
  const catalogs = storageCache.getItem('catalogs')
  const [lunesStandardVocabulary, catalogVocabulary] = await Promise.all([
    getWords(),
    Promise.all(catalogs.map(({ apiKey }) => getWordsForKey(apiKey))),
  ])
  const userVocabulary = storageCache.getItem('userVocabulary')
  return withoutDuplicates([...lunesStandardVocabulary, ...catalogVocabulary.flat(), ...userVocabulary])
}

const useLoadAllWords = (): Return<VocabularyItem[]> => useLoadAsync(loadAllWords, useStorageCache())

export default useLoadAllWords
