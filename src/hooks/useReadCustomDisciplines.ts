import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const loadFromAsyncStorage = async (): Promise<string[]> => AsyncStorage.getCustomDisciplines()

const useReadFromAsyncStorage = (): Return<string[]> => useLoadAsync(loadFromAsyncStorage, null)

export default useReadFromAsyncStorage
