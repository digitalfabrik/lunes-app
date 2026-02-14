import { StandardJobId } from '../models/Job'
import { StandardVocabularyItem } from '../models/VocabularyItem'
import { getWordsByJob } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadWordsByJob = (jobId: StandardJobId): Return<StandardVocabularyItem[]> => useLoadAsync(getWordsByJob, jobId)

export default useLoadWordsByJob
