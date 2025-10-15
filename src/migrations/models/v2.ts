export type AlternativeWord = {
  word: string
  article: Article
}

export type UserVocabularyItemRef = {
  type: 'user-created'
  id: number
}

export type StandardVocabularyItemRef = {
  type: 'lunes-standard'
  id: number
}

export type VocabularyItemRef = UserVocabularyItemRef | StandardVocabularyItemRef

export const ARTICLES = [
  {
    id: 0,
    value: 'keiner',
  },
  {
    id: 1,
    value: 'der',
  },
  {
    id: 2,
    value: 'die',
  },
  {
    id: 3,
    value: 'das',
  },
  {
    id: 4,
    value: 'die',
  },
] as const

type Article = (typeof ARTICLES)[number]

export type VocabularyItem = {
  ref: VocabularyItemRef
  word: string
  article: Article
  images: string[]
  audio: string | null
  alternatives: AlternativeWord[]
}

export type UserVocabularyItem = VocabularyItem & { ref: UserVocabularyItemRef }

/* eslint-disable no-magic-numbers */
type sections = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type WordNodeCard = {
  wordRef: VocabularyItemRef
  section: sections
  inThisSectionSince: Date
}

export type Favorite = VocabularyItemRef