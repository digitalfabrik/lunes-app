import { ARTICLES } from '../constants/data'
import { StandardVocabularyItem, UserVocabularyItem, VocabularyItemTypes } from '../models/VocabularyItem'
import { getAtIndex } from '../services/helpers'

const baseVocabularyItems: StandardVocabularyItem[] = [
  {
    id: { id: 1, type: VocabularyItemTypes.Standard },
    word: 'Spachtel',
    article: ARTICLES[1],
    images: ['image'],
    audio: 'https://example.com/my-audio',
    alternatives: [
      {
        word: 'Spachtel',
        article: ARTICLES[2],
      },
      {
        word: 'Alternative',
        article: ARTICLES[2],
      },
    ],
  },
  {
    id: { id: 2, type: VocabularyItemTypes.Standard },
    word: 'Auto',
    article: ARTICLES[3],
    images: ['image'],
    audio: '',
    alternatives: [],
  },
  {
    id: { id: 3, type: VocabularyItemTypes.Standard },
    word: 'Hose',
    article: ARTICLES[2],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: { id: 4, type: VocabularyItemTypes.Standard },
    word: 'Helm',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: { id: 5, type: VocabularyItemTypes.Standard },
    word: 'Abhänger',
    article: ARTICLES[3],
    audio: '',
    images: ['image'],
    alternatives: [
      {
        word: 'Abhänger',
        article: ARTICLES[2],
      },
    ],
  },
  {
    id: { id: 6, type: VocabularyItemTypes.Standard },
    word: 'Ölkanne',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [
      {
        word: 'Ölkännchen',
        article: ARTICLES[3],
      },
    ],
  },
  {
    id: { id: 7, type: VocabularyItemTypes.Standard },
    word: 'Riffeldübel',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [
      {
        word: 'Holzdübel',
        article: ARTICLES[1],
      },
    ],
  },
  {
    id: { id: 8, type: VocabularyItemTypes.Standard },
    word: 'Akkuschrauber',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: { id: 9, type: VocabularyItemTypes.Standard },
    word: 'Oberarm',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: { id: 10, type: VocabularyItemTypes.Standard },
    word: 'Untergrund',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
]

class VocabularyItemBuilder {
  vocabularyItemCount: number

  constructor(vocabularyItemCount: number) {
    this.vocabularyItemCount = vocabularyItemCount
  }

  build(): Array<StandardVocabularyItem> {
    return Array.from({ length: this.vocabularyItemCount }, (_, index) => {
      if (index < baseVocabularyItems.length) {
        return getAtIndex(baseVocabularyItems, index)
      }
      // For counts beyond the curated items, reuse their content but with a fresh unique
      // id so no two generated items share an id or object reference.
      const template = getAtIndex(baseVocabularyItems, index % baseVocabularyItems.length)
      return { ...template, id: { type: VocabularyItemTypes.Standard, id: index + 1 } }
    })
  }

  buildUserVocabulary(): Array<UserVocabularyItem> {
    return this.build().map(item => ({ ...item, id: { index: item.id.id, type: VocabularyItemTypes.UserCreated } }))
  }
}

export default VocabularyItemBuilder
