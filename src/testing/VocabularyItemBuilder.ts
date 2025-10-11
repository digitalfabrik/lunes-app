import { ARTICLES } from '../model/Article'
import VocabularyItem from '../model/VocabularyItem'

const vocabularyItems: VocabularyItem[] = [
  {
    id: 1,
    type: 'lunes-standard',
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
    type: 'lunes-standard',
    word: 'Auto',
    article: ARTICLES[3],
    images: ['image'],
    audio: '',
    alternatives: [],
  },
  {
    id: 3,
    type: 'lunes-standard',
    word: 'Hose',
    article: ARTICLES[2],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: 4,
    type: 'lunes-standard',
    word: 'Helm',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: 5,
    type: 'lunes-standard',
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
    type: 'lunes-standard',
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
    type: 'lunes-standard',
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
    type: 'lunes-standard',
    word: 'Akkuschrauber',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: 9,
    type: 'lunes-standard',
    word: 'Oberarm',
    article: ARTICLES[1],
    audio: '',
    images: ['image'],
    alternatives: [],
  },
  {
    id: 10,
    type: 'lunes-standard',
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
