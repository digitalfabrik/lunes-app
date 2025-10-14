import { ARTICLES } from '../model/Article'
import { StandardVocabularyItem, UserVocabularyItem } from '../model/VocabularyItem'

const vocabularyItems: StandardVocabularyItem[] = [
  {
    ref: { id: 1, type: 'lunes-standard' },
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
    ref: { id: 2, type: 'lunes-standard' },
    word: 'Auto',
    article: ARTICLES[3],
    images: ['image'],
    audio: '',
    alternatives: [],
  },
  {
    ref: { id: 3, type: 'lunes-standard' },
    word: 'Hose',
    article: ARTICLES[2],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    ref: { id: 4, type: 'lunes-standard' },
    word: 'Helm',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    ref: { id: 5, type: 'lunes-standard' },
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
    ref: { id: 6, type: 'lunes-standard' },
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
    ref: { id: 7, type: 'lunes-standard' },
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
    ref: { id: 8, type: 'lunes-standard' },
    word: 'Akkuschrauber',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    ref: { id: 9, type: 'lunes-standard' },
    word: 'Oberarm',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    ref: { id: 10, type: 'lunes-standard' },
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

  build(): Array<StandardVocabularyItem> {
    return vocabularyItems.slice(0, this.vocabularyItemCount)
  }

  buildUserVocabulary(): Array<UserVocabularyItem> {
    return this.build().map(item => ({ ...item, ref: { ...item.ref, type: 'user-created' } }))
  }
}

export default VocabularyItemBuilder
