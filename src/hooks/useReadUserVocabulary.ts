import { VocabularyItem } from '../constants/endpoints'
import { getUserVocabulary } from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadUserVocabulary = (): Return<VocabularyItem[]> => useLoadAsync(getUserVocabulary, null)

export default useReadUserVocabulary
