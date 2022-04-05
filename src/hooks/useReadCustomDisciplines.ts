import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadFromAsyncStorage = (): Return<string[]> => useLoadAsync(AsyncStorage.getCustomDisciplines, null)

export default useReadFromAsyncStorage
