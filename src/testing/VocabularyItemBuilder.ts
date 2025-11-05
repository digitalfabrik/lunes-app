import { ARTICLES, VOCABULARY_ITEM_TYPES } from '../constants/data'
import { VocabularyItem } from '../constants/endpoints'

const vocabularyItems: VocabularyItem[] = [
  {
    id: 1,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
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
    id: 2,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Auto',
    article: ARTICLES[3],
    images: ['image'],
    audio: '',
    alternatives: [],
  },
  {
    id: 3,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Hose',
    article: ARTICLES[2],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: 4,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Helm',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: 5,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
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
    id: 6,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
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
    id: 7,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
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
    id: 8,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Akkuschrauber',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: 9,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Oberarm',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: 10,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
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

    while (this.vocabularyItemCount > vocabularyItems.length) {
      vocabularyItems.push(vocabularyItems[0])
    }
  }

  build(): Array<VocabularyItem> {
    return vocabularyItems.slice(0, this.vocabularyItemCount)
  }
}

export default VocabularyItemBuilder
