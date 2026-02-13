import { JobId, StandardJob } from '../models/Job'
import { getJob } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadJob = (jobId: JobId): Return<StandardJob> => useLoadAsync(getJob, jobId)

export default useLoadJob
