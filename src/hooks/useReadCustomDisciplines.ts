import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const loadFromAsyncStorage = async (): Promise<string[]> => await AsyncStorage.getCustomDisciplines()

const useReadFromAsyncStorage = (): Return<string[]> => {
  return useLoadAsync(loadFromAsyncStorage, null)
}

export default useReadFromAsyncStorage
