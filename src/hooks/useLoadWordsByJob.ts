import { StandardJob } from '../models/Job'
import { StandardVocabularyItem } from '../models/VocabularyItem'
import { getWordsByJob } from '../services/CmsApi'
import useLoadAsync, { Return } from './useLoadAsync'

const loadWordsByJob = async ({ job }: { job: StandardJob }) => getWordsByJob(job.id, job.apiKey)

const useLoadWordsByJob = (job: StandardJob): Return<StandardVocabularyItem[]> => useLoadAsync(loadWordsByJob, { job })

export default useLoadWordsByJob
