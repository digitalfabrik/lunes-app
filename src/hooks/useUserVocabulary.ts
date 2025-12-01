import { VocabularyItem } from '../constants/endpoints'
import { getUserVocabularyItems } from '../services/storageUtils'
import useStorage from './useStorage'

const useUserVocabulary = (): VocabularyItem[] => {
  const [userVocabulary] = useStorage('userVocabulary')
  return getUserVocabularyItems(userVocabulary)
}

export default useUserVocabulary
