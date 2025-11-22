import { Article, ARTICLES } from '../constants/data'
import { Discipline, NetworkError, VocabularyItem } from '../constants/endpoints'
import { isTypeLoadProtected } from '../hooks/helpers'
import Feedback, { FeedbackTarget } from '../models/Feedback'
import { StandardUnit, StandardUnitId } from '../models/Unit'
import Sponsor from '../models/sponsor'
import { getFromEndpoint, postToEndpoint } from './axios'

const Endpoints = {
  feedback: 'feedback',
  jobs: 'jobs',
  job: (id: number) => `jobs/${id}`,
  unitsOfJob: (jobId: number) => `jobs/${jobId}/units`,
  sponsors: 'sponsors',
  words: 'words',
  word: (id: number) => `words/${id}`,
  wordsOfUnit: (unitId: StandardUnitId) => `units/${unitId.id}/words`,
}

type PostFeedback = {
  comment: string
  object_id: number
  content_type: FeedbackTarget['type']
}

// eslint-disable-next-line consistent-return
const transformFeedbackToPostFeedback = ({ comment, target }: Feedback): PostFeedback => {
  switch (target.type) {
    case 'job':
      return { comment, content_type: target.type, object_id: target.jobId }
    case 'unit':
      return { comment, content_type: target.type, object_id: target.unitId.id }
    case 'word':
      return { comment, content_type: target.type, object_id: target.wordId }
  }
}

export const postFeedback = async (feedback: Feedback): Promise<void> => {
  await postToEndpoint(Endpoints.feedback, transformFeedbackToPostFeedback(feedback))
}

type JobResponse = {
  id: number
  name: string
  icon: string | null
  number_units: number
}

const transformJobsResponse = ({ id, name, icon, number_units: numberUnits }: JobResponse): Discipline => ({
  id,
  title: name,
  description: '',
  icon: icon ?? undefined,
  numberOfChildren: numberUnits,
  isLeaf: false,
  parentTitle: null,
  needsTrainingSetEndpoint: false,
})

export const getJobs = async (): Promise<Discipline[]> => {
  const response = await getFromEndpoint<JobResponse[]>(Endpoints.jobs)
  return response.map(transformJobsResponse)
}

export type JobId =
  | {
      apiKey: string
    }
  | {
      disciplineId: number
    }

export const getJob = async (id: JobId): Promise<Discipline> =>
  !isTypeLoadProtected(id)
    ? transformJobsResponse(await getFromEndpoint<JobResponse>(Endpoints.job(id.disciplineId)))
    : Promise.reject(new Error(NetworkError)) // TODO: Add support back to the cms

type UnitResponse = {
  id: number
  title: string
  description: string
  icon: string | null
  number_words: number
}

const transformUnitsResponse = ({
  id,
  title,
  description,
  icon: iconUrl,
  number_words: numberWords,
}: UnitResponse): StandardUnit => ({
  id: { id, type: 'standard' },
  title,
  description,
  iconUrl,
  numberWords,
})

export const getUnitsOfJob = async (jobId: number): Promise<StandardUnit[]> => {
  const response = await getFromEndpoint<UnitResponse[]>(Endpoints.unitsOfJob(jobId))
  return response.map(transformUnitsResponse)
}

type SponsorResponse = {
  id: number
  name: string
  url: string
  logo: string | null
}

const transformSponsorResponse = ({ name, url, logo }: SponsorResponse): Sponsor => ({
  name,
  url: url || null,
  logo,
})

export const getSponsors = async (): Promise<Sponsor[]> => {
  const response = await getFromEndpoint<SponsorResponse[]>(Endpoints.sponsors)
  return response.map(transformSponsorResponse)
}

type CMSArticle = 'keiner' | 'der' | 'die' | 'das' | 'die (Plural)'

const CMSArticleToArticle: Record<CMSArticle, Article> = {
  keiner: ARTICLES[0],
  der: ARTICLES[1],
  die: ARTICLES[2],
  das: ARTICLES[3],
  'die (Plural)': ARTICLES[4],
}

type WordResponse = {
  id: number
  word: string
  article: CMSArticle
  images: string[]
  audio: string
}

const transformWordResponse = ({ id, word, article, images, audio }: WordResponse): VocabularyItem => ({
  id,
  word,
  article: CMSArticleToArticle[article],
  images,
  audio,
  type: 'lunes-standard',
  alternatives: [],
})

export const getWords = async (): Promise<VocabularyItem[]> => {
  const response = await getFromEndpoint<WordResponse[]>(Endpoints.words)
  return response.map(transformWordResponse)
}

export const getWordById = async (id: number): Promise<VocabularyItem> => {
  const response = await getFromEndpoint<WordResponse>(Endpoints.word(id))
  return transformWordResponse(response)
}

export const getWordsByUnit = async (unitId: StandardUnitId): Promise<VocabularyItem[]> => {
  const response = await getFromEndpoint<WordResponse[]>(Endpoints.wordsOfUnit(unitId))
  return response.map(transformWordResponse)
}
