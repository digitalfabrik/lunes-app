import VocabularyItem from '../model/VocabularyItem'
import { getWords } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadAllVocabularyItems = (): Return<VocabularyItem[]> => useLoadAsync(getWords, undefined)

export default useLoadAllVocabularyItems
