import { Article, ARTICLES } from '../constants/data'
import { NetworkError } from '../constants/endpoints'
import { WithToken } from '../models/ContentArea'
import Feedback, { FeedbackTarget } from '../models/Feedback'
import { JobId, StandardJob, StandardJobId } from '../models/Job'
import Sponsor from '../models/Sponsor'
import { StandardUnit, StandardUnitId } from '../models/Unit'
import {
  ProtectedVocabularyId,
  StandardVocabularyId,
  StandardVocabularyItem,
  VocabularyItemTypes,
} from '../models/VocabularyItem'
import { AnalyticsEvent, AnalyticsPayload } from './AnalyticsService'
import { deleteFromEndpoint, getFromEndpoint, postToEndpoint } from './axios'
import { log, reportError } from './sentry'

const Endpoints = {
  feedback: 'feedback',
  jobs: 'jobs',
  job: (id: StandardJobId) => `jobs/${id.id}`,
  unitsOfJob: (id: StandardJobId) => `jobs/${id.id}/units`,
  sponsors: 'sponsors',
  words: 'words',
  word: (id: StandardVocabularyId) => `words/${id.id}`,
  wordsOfUnit: (unitId: StandardUnitId) => `units/${unitId.id}/words`,
  wordsOfJob: (jobId: StandardJobId) => `jobs/${jobId.id}/words`,
  analyticsEvent: 'analytics/events',
  analyticsExport: (installationId: string) => `analytics/export/${installationId}/`,
  analyticsDelete: (installationId: string) => `analytics/data/${installationId}/`,
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
      return { comment, content_type: target.type, object_id: target.jobId.id }
    case 'unit':
      return { comment, content_type: target.type, object_id: target.unitId.id }
    case 'word':
      return { comment, content_type: target.type, object_id: target.wordId.id }
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
  migrated: boolean
}

const transformJobResponse = (
  { id, name, icon, number_units: numberUnits, migrated }: JobResponse,
  token: string | undefined,
): StandardJob => ({
  id: { type: 'standard', id },
  name,
  icon,
  numberOfUnits: numberUnits,
  migrated,
  token,
})

export const getJobs = async (): Promise<StandardJob[]> => {
  const response = await getFromEndpoint<JobResponse[]>(Endpoints.jobs)
  return response.map(job => transformJobResponse(job, undefined))
}

export const getJob = async ({ id, token }: WithToken<JobId>): Promise<StandardJob> =>
  id.type === 'standard'
    ? transformJobResponse(await getFromEndpoint<JobResponse>(Endpoints.job(id), token), token)
    : // TODO: remove (#1539)
      Promise.reject(new Error(NetworkError))

type UnitResponse = {
  id: number
  title: string
  description: string
  icon: string | null
  number_words: number
}

const transformUnitResponse = (
  { id, title, description, icon: iconUrl, number_words: numberWords }: UnitResponse,
  token: string | undefined,
): StandardUnit => ({
  id: { id, type: 'standard' },
  title,
  description,
  iconUrl,
  numberWords,
  token,
})

export const getUnitsOfJob = async ({ id, token }: WithToken<JobId>): Promise<StandardUnit[]> => {
  // TODO: remove (#1539)
  if (id.type !== 'standard') {
    return Promise.reject(new Error(NetworkError))
  }
  const response = await getFromEndpoint<UnitResponse[]>(Endpoints.unitsOfJob(id), token)
  return response.map(unit => transformUnitResponse(unit, token))
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
  alternative_words: {
    alt_word: string
    article: CMSArticle
  }[]
  example_sentence: string | null
  example_sentence_audio: string | null
  pronunciation: string
}

const transformWordResponse = (response: WordResponse, token: string | undefined): StandardVocabularyItem => {
  const { id, word, article, images, audio, pronunciation, alternative_words: alternativeWords } = response
  return {
    id: { type: VocabularyItemTypes.Standard, id },
    word,
    article: CMSArticleToArticle[article],
    images,
    audio,
    alternatives: alternativeWords.map(({ alt_word: altWord, article: altArticle }) => ({
      word: altWord,
      article: CMSArticleToArticle[altArticle],
    })),
    // The CMS sends an empty string for words that need no special pronunciation
    pronunciation: pronunciation || undefined,
    token,
    exampleSentence:
      response.example_sentence !== null && response.example_sentence_audio !== null
        ? { sentence: response.example_sentence, audio: response.example_sentence_audio }
        : undefined,
  }
}

export const getWords = async (token?: string): Promise<StandardVocabularyItem[]> => {
  const response = await getFromEndpoint<WordResponse[]>(Endpoints.words, token)
  return response.map(word => transformWordResponse(word, token))
}

export const getWordById = async ({
  id,
  token,
}: WithToken<StandardVocabularyId | ProtectedVocabularyId>): Promise<StandardVocabularyItem> => {
  // TODO: remove (#1539)
  if (id.type === VocabularyItemTypes.Protected) {
    return Promise.reject(new Error(NetworkError))
  }
  const response = await getFromEndpoint<WordResponse>(Endpoints.word(id), token)
  return transformWordResponse(response, token)
}

export const getWordsByUnit = async ({ id, token }: WithToken<StandardUnitId>): Promise<StandardVocabularyItem[]> => {
  const response = await getFromEndpoint<WordResponse[]>(Endpoints.wordsOfUnit(id), token)
  return response.map(word => transformWordResponse(word, token))
}

export const getWordsByJob = async ({ id, token }: WithToken<StandardJobId>): Promise<StandardVocabularyItem[]> => {
  const response = await getFromEndpoint<WordResponse[]>(Endpoints.wordsOfJob(id), token)
  return response.map(word => transformWordResponse(word, token))
}

type AnalyticsEventPostData = Omit<AnalyticsEvent, 'payload'> & {
  event_type: AnalyticsPayload['type']
  payload: Omit<AnalyticsPayload, 'type'>
}

const transformAnalyticsEvent = ({ installation_id, timestamp, payload }: AnalyticsEvent): AnalyticsEventPostData => {
  const { type, ...rest } = payload
  return {
    installation_id,
    event_type: type,
    timestamp,
    payload: rest,
  }
}

export const postAnalyticEvent = async (event: AnalyticsEvent): Promise<void> => {
  await postToEndpoint(Endpoints.analyticsEvent, transformAnalyticsEvent(event)).catch(e => {
    reportError(e)
    log(JSON.stringify(e.response?.data), 'warning')
  })
}

export const getAnalyticsExport = async (installationId: string): Promise<Record<string, unknown>> =>
  getFromEndpoint(Endpoints.analyticsExport(installationId), undefined, true)

export const deleteAnalyticsData = async (installationId: string): Promise<void> => {
  await deleteFromEndpoint(Endpoints.analyticsDelete(installationId))
}
