import { Discipline } from '../constants/endpoints'
import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadFromAsyncStorage = (profession: Discipline): Return<number> =>
  useLoadAsync(AsyncStorage.getProgress, profession)

export default useReadFromAsyncStorage
