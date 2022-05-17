import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadFromAsyncStorage = (): Return<number[] | null> => useLoadAsync(AsyncStorage.getSelectedProfessions, null)

export default useReadFromAsyncStorage
