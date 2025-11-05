import { Discipline } from '../constants/endpoints'
import { getJobs } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadAllJobs = (): Return<Discipline[]> => useLoadAsync(getJobs, {})

export default useLoadAllJobs
