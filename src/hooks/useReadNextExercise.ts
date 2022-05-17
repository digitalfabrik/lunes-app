import { NextExercise } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import { getNextExercise } from '../services/helpers'
import useLoadAsync, { Return } from './useLoadAsync'

const useReadNextExercise = (profession: Discipline | null): Return<NextExercise | null> =>
  useLoadAsync(getNextExercise, profession)

export default useReadNextExercise
