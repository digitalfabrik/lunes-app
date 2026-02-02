import { JobId } from '../models/Job'
import { StandardUnit } from '../models/Unit'
import { getUnitsOfJob } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const loadUnits = async ({ jobId }: { jobId: JobId }) => getUnitsOfJob(jobId)

const useLoadUnits = (jobId: JobId): Return<StandardUnit[]> => useLoadAsync(loadUnits, { jobId })

export default useLoadUnits
