import Job from '../models/Job'
import { StandardUnit } from '../models/Unit'
import { getUnitsOfJob } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadUnits = (job: Job): Return<StandardUnit[]> => useLoadAsync(getUnitsOfJob, { id: job.id, token: job.token })

export default useLoadUnits
