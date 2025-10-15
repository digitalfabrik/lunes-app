import { ARTICLES } from '../constants/data'
import { VocabularyItem } from '../constants/endpoints'
import { getFromEndpoint } from './axios'

const ENDPOINTS = {
  words: 'words',
  word: (id: number) => `words/${id}`,
}

type WordResponse = {
  id: number
  word: string
  article: number
  image: string
  audio: string
}

const transformWordResponse = ({ id, word, article, image, audio }: WordResponse): VocabularyItem => ({
  id,
  word,
  article: ARTICLES[article],
  images: [{ id: -1, image }],
  audio,
  type: 'user-created',
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
