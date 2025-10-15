export const VOCABULARY_ITEM_TYPES = {
  lunesStandard: 'lunes-standard',
  lunesProtected: 'lunes-protected',
  userCreated: 'user-created',
} as const
export type VocabularyItemType = (typeof VOCABULARY_ITEM_TYPES)[keyof typeof VOCABULARY_ITEM_TYPES]

export type ArticleType = {
  readonly id: number
  readonly value: string
}

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

export type Article = (typeof ARTICLES)[number]

export type Image = {
  id: number
  image: string
}

export type Images = Image[]

export type AlternativeWord = {
  word: string
  article: Article
}

export type VocabularyItem = {
  id: number
  type: VocabularyItemType
  word: string
  article: Article
  images: Images
  audio: string | null
  alternatives: AlternativeWord[]
  apiKey?: string
}

export type UserVocabularyItem = Omit<VocabularyItem, 'type'>

// eslint-disable-next-line no-magic-numbers
type sections = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type WordNodeCard = {
  word: VocabularyItem
  section: sections
  inThisSectionSince: Date
}

export type Favorite = {
  id: number
  vocabularyItemType: VocabularyItemType
  apiKey?: string
}
