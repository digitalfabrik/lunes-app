import { Article, ARTICLES } from '../constants/data'
import { VocabularyItem } from '../constants/endpoints'
import { getFromEndpoint } from './axios'

const ENDPOINTS = {
  words: 'words',
  word: (id: number) => `words/${id}`,
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
  const response = await getFromEndpoint<WordResponse[]>(ENDPOINTS.words)
  return response.map(transformWordResponse)
}

export const getWordById = async (id: number): Promise<VocabularyItem> => {
  const response = await getFromEndpoint<WordResponse>(ENDPOINTS.word(id))
  return transformWordResponse(response)
}
