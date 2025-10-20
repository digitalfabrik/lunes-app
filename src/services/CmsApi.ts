import { Article, ARTICLES } from '../constants/data'
import { Discipline, NetworkError, VocabularyItem } from '../constants/endpoints'
import { isTypeLoadProtected } from '../hooks/helpers'
import { getFromEndpoint } from './axios'

const Endpoints = {
  jobs: 'jobs',
  job: (id: number) => `jobs/${id}`,
  words: 'words',
  word: (id: number) => `words/${id}`,
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
  image: string
  audio: string
}

const transformWordResponse = ({ id, word, article, image, audio }: WordResponse): VocabularyItem => ({
  id,
  word,
  article: CMSArticleToArticle[article],
  images: [image],
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
