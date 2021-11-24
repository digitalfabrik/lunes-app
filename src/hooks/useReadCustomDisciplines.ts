import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { ReturnType } from './useLoadAsync'

const loadFromAsyncStorage = async (): Promise<string[]> => await AsyncStorage.getCustomDisciplines()

const useReadFromAsyncStorage = (): ReturnType<string[]> => {
  return useLoadAsync(loadFromAsyncStorage, null)
}

export default useReadFromAsyncStorage
