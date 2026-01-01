import { StandardJobId } from './Job'
import { StandardUnitId } from './Unit'
import { StandardVocabularyId } from './VocabularyItem'

export type JobFeedbackTarget = {
  type: 'job'
  jobId: StandardJobId
}

export type UnitFeedbackTarget = {
  type: 'unit'
  unitId: StandardUnitId
}

export type WordFeedbackTarget = {
  type: 'word'
  wordId: StandardVocabularyId
}

export type FeedbackTarget = JobFeedbackTarget | UnitFeedbackTarget | WordFeedbackTarget

type Feedback = {
  comment: string
  target: FeedbackTarget
}

export default Feedback
