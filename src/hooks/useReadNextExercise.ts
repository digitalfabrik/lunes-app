import { Discipline } from '../constants/endpoints'
import { getNextExercise } from '../services/helpers'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadNextExercise = (profession: Discipline): Return<{ disciplineId: number; exerciseKey: number }> =>
  useLoadAsync(getNextExercise, profession)

export default useReadNextExercise
