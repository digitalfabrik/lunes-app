import { getCustomDisciplines } from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadFromAsyncStorage = (): Return<string[]> => useLoadAsync(getCustomDisciplines, null)

export default useReadFromAsyncStorage
