import { Discipline } from '../constants/endpoints'
import AsyncStorage from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadFromAsyncStorage = (): Return<Discipline[] | null> =>
  useLoadAsync(AsyncStorage.getSelectedProfessions, null)

export default useReadFromAsyncStorage
