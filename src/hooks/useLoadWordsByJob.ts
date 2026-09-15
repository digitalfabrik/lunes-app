import { StandardJob } from '../models/Job'
import { StandardVocabularyItem } from '../models/VocabularyItem'
import { getWordsByJob } from '../services/CmsApi'
import useLoadAsync, { Return } from './useLoadAsync'

const useLoadWordsByJob = (job: StandardJob): Return<StandardVocabularyItem[]> =>
  useLoadAsync(getWordsByJob, { id: job.id, token: job.token })

export default useLoadWordsByJob
