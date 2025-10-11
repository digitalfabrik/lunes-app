import VocabularyItem from '../model/VocabularyItem'
import { getUserVocabularyItems } from '../services/storageUtils'
import useStorage from './useStorage'

const useReadUserVocabulary = (): VocabularyItem[] => {
  const [userVocabulary] = useStorage('userVocabulary')
  return getUserVocabularyItems(userVocabulary)
}

export default useReadUserVocabulary
