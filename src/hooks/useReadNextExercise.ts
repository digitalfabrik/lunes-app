import { useCallback } from 'react'

import { NextExercise } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import { getNextExercise } from '../services/helpers'
import useLoadAsync, { Return } from './useLoadAsync'
import useStorage from './useStorage'

const useReadNextExercise = (profession: Discipline): Return<NextExercise> => {
  const [progress] = useStorage('progress')
  return useLoadAsync(
    useCallback(() => getNextExercise(progress, profession), [progress, profession]),
    null,
  )
}

export default useReadNextExercise
