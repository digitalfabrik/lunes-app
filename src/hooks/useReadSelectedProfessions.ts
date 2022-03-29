import { Discipline } from '../constants/endpoints'
import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const loadFromAsyncStorage = async (): Promise<Discipline[] | null> => AsyncStorage.getSelectedProfessions()

const useReadFromAsyncStorage = (): Return<Discipline[] | null> => useLoadAsync(loadFromAsyncStorage, null)

export default useReadFromAsyncStorage
