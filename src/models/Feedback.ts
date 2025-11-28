import { StandardJobId } from './Job'
import { StandardUnitId } from './Unit'

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
  wordId: number
}

export type FeedbackTarget = JobFeedbackTarget | UnitFeedbackTarget | WordFeedbackTarget

type Feedback = {
  comment: string
  target: FeedbackTarget
}

export default Feedback
