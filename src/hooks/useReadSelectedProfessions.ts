import { getSelectedProfessions } from '../services/AsyncStorage'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadFromAsyncStorage = (): Return<number[] | null> => useLoadAsync(getSelectedProfessions, null)

export default useReadFromAsyncStorage
