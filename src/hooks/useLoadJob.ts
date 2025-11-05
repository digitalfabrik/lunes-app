import { Discipline } from '../constants/endpoints'
import { getJob, JobId } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadJob = (jobId: JobId): Return<Discipline> => useLoadAsync(getJob, jobId)

export default useLoadJob
