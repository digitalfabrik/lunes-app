import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const loadFromAsyncStorage = async (): Promise<number[] | null> => AsyncStorage.getSelectedProfessions()

const useReadFromAsyncStorage = (): Return<number[] | null> => useLoadAsync(loadFromAsyncStorage, null)

export default useReadFromAsyncStorage
