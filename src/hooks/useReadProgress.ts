import { Progress } from '../constants/data'
import Job from '../models/Job'
import { getProgress } from '../services/helpers'
import { Return, useLoadAsync } from './useLoadAsync'
import useStorage from './useStorage'

const useReadFromAsyncStorage = async ({ job, progress }: { job: Job; progress: Progress }): Promise<number> =>
  getProgress(progress, job)

const useReadProgress = (job: Job): Return<number> =>
  useLoadAsync(useReadFromAsyncStorage, { job, progress: useStorage('progress')[0] })

export default useReadProgress
