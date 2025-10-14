import { UserVocabularyItem } from '../model/VocabularyItem'
import useStorage from './useStorage'

const useReadUserVocabulary = (): UserVocabularyItem[] => {
  const [userVocabulary] = useStorage('userVocabulary')
  return userVocabulary.slice()
}

export default useReadUserVocabulary
