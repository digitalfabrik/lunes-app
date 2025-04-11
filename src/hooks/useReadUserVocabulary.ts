import { VocabularyItem } from '../constants/endpoints'
import { getUserVocabularyItems } from '../services/AsyncStorage'
import useStorage from './useStorage'

const useReadUserVocabulary = (): VocabularyItem[] => {
  const [userVocabulary] = useStorage('userVocabulary')
  return getUserVocabularyItems(userVocabulary)
}

export default useReadUserVocabulary
