import { Discipline } from '../constants/endpoints'
import { getProgress } from '../services/helpers'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadFromAsyncStorage = (profession: Discipline | null): Return<number> => useLoadAsync(getProgress, profession)

export default useReadFromAsyncStorage
