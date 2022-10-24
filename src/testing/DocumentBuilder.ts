import { ARTICLES, DOCUMENT_TYPES } from '../constants/data'
import { Document } from '../constants/endpoints'

const document: Document[] = [
  {
    id: 1,
    documentType: DOCUMENT_TYPES.lunesStandard,
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
    documentType: DOCUMENT_TYPES.lunesStandard,
    word: 'Auto',
    article: ARTICLES[3],
    document_image: [{ id: 1, image: 'image' }],
    audio: '',
    alternatives: [],
  },
  {
    id: 3,
    documentType: DOCUMENT_TYPES.lunesStandard,
    word: 'Hose',
    article: ARTICLES[2],
    audio: '',
    document_image: [{ id: 1, image: 'image' }],
    alternatives: [],
  },
  {
    id: 4,
    documentType: DOCUMENT_TYPES.lunesStandard,
    word: 'Helm',
    article: ARTICLES[1],
    audio: '',
    document_image: [{ id: 2, image: 'image' }],
    alternatives: [],
  },
]

class DocumentBuilder {
  documentCount: number

  constructor(documentCount: number) {
    this.documentCount = documentCount

    if (this.documentCount > document.length) {
      throw new Error(`Only ${document.length} documents can be created`)
    }
  }

  build(): Array<Document> {
    return document.slice(0, this.documentCount)
  }
}

export default DocumentBuilder
