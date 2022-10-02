import { Document } from '../constants/endpoints'
import { getUserVocabulary } from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadUserVocabulary = (): Return<Document[]> => useLoadAsync(getUserVocabulary, null)

export default useReadUserVocabulary
