import { Discipline } from '../constants/endpoints'
import { getJob } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'
import { RequestParams } from './useLoadDiscipline'

const useLoadJob = (jobId: RequestParams): Return<Discipline> => useLoadAsync(getJob, jobId)

export default useLoadJob
