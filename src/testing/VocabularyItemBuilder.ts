import { ARTICLES } from '../constants/data'
import { VocabularyItem } from '../constants/endpoints'

const vocabularyItems: VocabularyItem[] = [
  {
    id: 1,
    word: 'Spachtel',
    article: ARTICLES[1],
    document_image: [{ id: 1, image: 'image' }],
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
    word: 'Auto',
    article: ARTICLES[3],
    document_image: [{ id: 1, image: 'image' }],
    audio: '',
    alternatives: [],
  },
  {
    audio: '',
    word: 'Hose',
    id: 3,
    article: ARTICLES[2],
    document_image: [{ id: 1, image: 'image' }],
    alternatives: [],
  },
  {
    audio: '',
    word: 'Helm',
    id: 4,
    article: ARTICLES[1],
    document_image: [{ id: 2, image: 'image' }],
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
