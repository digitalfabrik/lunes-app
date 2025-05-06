import { NextExercise } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import { getNextExercise } from '../services/helpers'
import useLoadAsync, { Return } from './useLoadAsync'
import useStorage from './useStorage'

const useReadNextExercise = (profession: Discipline): Return<NextExercise> => {
  const [progress] = useStorage('progress')
  return useLoadAsync(getNextExercise, { progress, profession })
}

export default useReadNextExercise
