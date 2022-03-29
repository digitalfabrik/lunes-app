import { Discipline } from '../constants/endpoints'
import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const loadFromAsyncStorage = async (profession: Discipline): Promise<number> => AsyncStorage.getProgress(profession)

const useReadFromAsyncStorage = (profession: Discipline): Return<number> =>
  useLoadAsync(loadFromAsyncStorage, profession)

export default useReadFromAsyncStorage
