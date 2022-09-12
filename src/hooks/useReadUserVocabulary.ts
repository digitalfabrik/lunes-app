import { Document } from '../constants/endpoints'
import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadUserVocabulary = (): Return<Document[]> => useLoadAsync(AsyncStorage.getUserVocabulary, null)

export default useReadUserVocabulary
