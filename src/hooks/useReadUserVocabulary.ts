import { VocabularyItem } from '../constants/endpoints'
import { getUserVocabularyItems } from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadUserVocabulary = (): Return<VocabularyItem[]> => useLoadAsync(getUserVocabularyItems, null)

export default useReadUserVocabulary
