import { ARTICLES } from '../model/Article'
import VocabularyItem, { StandardVocabularyItem } from '../model/VocabularyItem'
import { StandardVocabularyItemRef } from '../model/VocabularyItemRef'
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

const transformWordResponse = ({ id, word, article, image, audio }: WordResponse): StandardVocabularyItem => ({
  ref: { id, type: 'lunes-standard' },
  word,
  article: ARTICLES[article],
  images: [image],
  audio,
  alternatives: [],
})

export const getWords = async (): Promise<StandardVocabularyItem[]> => {
  const response = await getFromEndpoint<WordResponse[]>(ENDPOINTS.words)
  return response.map(transformWordResponse)
}

export const getWordByRef = async (ref: StandardVocabularyItemRef): Promise<VocabularyItem> => {
  const response = await getFromEndpoint<WordResponse>(ENDPOINTS.word(ref.id))
  return transformWordResponse(response)
}
