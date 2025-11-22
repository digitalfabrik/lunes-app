import { Discipline, VocabularyItem } from '../constants/endpoints'
import { getWordsByJob } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadWordsByJob = (job: Discipline): Return<VocabularyItem[]> => useLoadAsync(getWordsByJob, job.id)

export default useLoadWordsByJob
