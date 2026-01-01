import Job, { JobId } from '../models/Job'
import { getJob } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadJob = (jobId: JobId): Return<Job> => useLoadAsync(getJob, jobId)

export default useLoadJob
