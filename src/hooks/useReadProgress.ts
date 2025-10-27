import { Progress } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import { getProgress } from '../services/helpers'
import { Return, useLoadAsync } from './useLoadAsync'
import useStorage from './useStorage'

const useReadFromAsyncStorage = async ({ job, progress }: { job: Discipline; progress: Progress }): Promise<number> =>
  getProgress(progress, job)

const useReadProgress = (job: Discipline): Return<number> =>
  useLoadAsync(useReadFromAsyncStorage, { job, progress: useStorage('progress')[0] })

export default useReadProgress
