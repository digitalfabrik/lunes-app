import { JobId, StandardJob } from '../models/Job'
import { getJob } from '../services/CmsApi'
import { tokenForJob } from '../services/storageUtils'
import { Return, useLoadAsync } from './useLoadAsync'
import useStorage from './useStorage'

const loadJob = async ({ jobId, token }: { jobId: JobId; token?: string }) => getJob(jobId, token)

const useLoadJob = (jobId: JobId): Return<StandardJob> => {
  const [selectedJobs] = useStorage('selectedJobs')
  const token = jobId.type === 'standard' ? tokenForJob(selectedJobs, jobId) : undefined
  return useLoadAsync(loadJob, { jobId, token })
}

export default useLoadJob
