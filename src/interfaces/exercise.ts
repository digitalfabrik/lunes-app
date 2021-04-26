export interface IAlternativeWordProps {
  alt_word: string
  article: string
}

export interface IDocumentProps {
  id: number
  word: string
  article: string
  document_image: Array<{ id: number; image: string }>
  audio: string
  alternatives: IAlternativeWordProps[]
}
