import { ARTICLES, VOCABULARY_ITEM_TYPES } from '../constants/data'
import { VocabularyItem } from '../constants/endpoints'

const vocabularyItems: VocabularyItem[] = [
  {
    id: 1,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Spachtel',
    article: ARTICLES[1],
    image: [{ id: 1, image: 'image' }],
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
    image: [{ id: 1, image: 'image' }],
    audio: '',
    alternatives: [],
  },
  {
    id: 3,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Hose',
    article: ARTICLES[2],
    audio: '',
    image: [{ id: 1, image: 'image' }],
    alternatives: [],
  },
  {
    id: 4,
    type: VOCABULARY_ITEM_TYPES.lunesStandard,
    word: 'Helm',
    article: ARTICLES[1],
    audio: '',
    image: [{ id: 2, image: 'image' }],
    alternatives: [],
  },
]

class VocabularyItemBuilder {
  documentCount: number

  constructor(documentCount: number) {
    this.documentCount = documentCount

    if (this.documentCount > vocabularyItems.length) {
      throw new Error(`Only ${vocabularyItems.length} documents can be created`)
    }
  }

  build(): Array<VocabularyItem> {
    return vocabularyItems.slice(0, this.documentCount)
  }
}

export default VocabularyItemBuilder
