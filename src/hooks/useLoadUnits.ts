import Job from '../models/Job'
import { StandardUnit } from '../models/Unit'
import { getUnitsOfJob } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const loadUnits = async ({ job }: { job: Job }) => getUnitsOfJob(job.id, job.apiKey)

const useLoadUnits = (job: Job): Return<StandardUnit[]> => useLoadAsync(loadUnits, { job })

export default useLoadUnits
