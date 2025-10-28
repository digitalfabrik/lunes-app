import { StandardUnit } from '../models/Unit'
import { getUnitsOfJob } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const loadUnits = async ({ jobId }: { jobId: number }) => getUnitsOfJob(jobId)

const useLoadUnits = (jobId: number): Return<StandardUnit[]> => useLoadAsync(loadUnits, { jobId })

export default useLoadUnits
