import VocabularyItem, { serializeVocabularyItemId, StandardVocabularyItem } from '../models/VocabularyItem'
import { getWords, getWordsWithKey } from '../services/CmsApi'
import { StorageCache } from '../services/Storage'
import { reportError } from '../services/sentry'
import { Return, useLoadAsync } from './useLoadAsync'
import { useStorageCache } from './useStorage'

const withoutDuplicateIds = (vocabularyItems: VocabularyItem[]): VocabularyItem[] => {
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

const wordsOfContentArea = async (apiKey: string): Promise<StandardVocabularyItem[]> => {
  try {
    return await getWordsWithKey(apiKey)
  } catch (error) {
    // An unreachable content area must not take the public and the user vocabulary down with it
    reportError(error)
    return []
  }
}

export const loadAllWords = async (storageCache: StorageCache): Promise<VocabularyItem[]> => {
  const contentAreas = storageCache.getItem('contentAreas')
  const [lunesStandardVocabulary, contentAreaVocabulary] = await Promise.all([
    getWords(),
    Promise.all(contentAreas.map(({ apiKey }) => wordsOfContentArea(apiKey))),
  ])
  const userVocabulary = storageCache.getItem('userVocabulary')
  return withoutDuplicateIds([...lunesStandardVocabulary, ...contentAreaVocabulary.flat(), ...userVocabulary])
}

const useLoadAllWords = (): Return<VocabularyItem[]> => useLoadAsync(loadAllWords, useStorageCache())

export default useLoadAllWords
