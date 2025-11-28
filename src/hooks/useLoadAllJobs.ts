import { StandardJob } from '../models/Job'
import { getJobs } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadAllJobs = (): Return<StandardJob[]> => useLoadAsync(getJobs, {})

export default useLoadAllJobs
