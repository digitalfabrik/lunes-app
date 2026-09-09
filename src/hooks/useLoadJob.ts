import { JobId, StandardJob } from '../models/Job'
import { getJob } from '../services/CmsApi'
import { apiKeyForJob } from '../services/storageUtils'
import { Return, useLoadAsync } from './useLoadAsync'
import useStorage from './useStorage'

const loadJob = async ({ jobId, apiKey }: { jobId: JobId; apiKey?: string }) => getJob(jobId, apiKey)

const useLoadJob = (jobId: JobId): Return<StandardJob> => {
  const [catalogs] = useStorage('catalogs')
  const apiKey = jobId.type === 'standard' ? apiKeyForJob(catalogs, jobId) : undefined
  return useLoadAsync(loadJob, { jobId, apiKey })
}

export default useLoadJob
