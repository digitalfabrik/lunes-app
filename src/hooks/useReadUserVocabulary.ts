import { VocabularyItem } from '../constants/endpoints'
import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadUserVocabulary = (): Return<VocabularyItem[]> => useLoadAsync(AsyncStorage.getUserVocabularyItems, null)

export default useReadUserVocabulary
