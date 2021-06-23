import useLoadFromEndpoint, { ReturnType } from './useLoadFromEndpoint'
import { AlternativeWordType, DocumentType, ENDPOINTS } from '../constants/endpoints'
import { ARTICLES } from '../constants/data'
import { useEffect, useState } from 'react'

export interface DocumentTypeFromServer {
  id: number
  word: string
  article: number
  document_image: Array<{ id: number; image: string }>
  audio: string
  alternatives: AlternativeWordType[]
}

const transformArticle = (documents: ReturnType<DocumentTypeFromServer[]>): ReturnType<DocumentType[]> => {
  const documentsWithTransformedArticle: DocumentType[] = []
  documents.data?.forEach(doc => {
    const { article, ...rest } = doc
    const formattedArticle = ARTICLES.find(article => {
      return article.id === doc.article
    })
    if (!formattedArticle) {
      throw new Error('Invalid Server Response')
    }
    const formattedDocument: DocumentType = { ...rest, article: formattedArticle }
    documentsWithTransformedArticle.push(formattedDocument)
  })
  const { data, ...rest } = documents
  return { ...rest, data: documentsWithTransformedArticle }
}

const useLoadDocuments = (trainingSetId: number): ReturnType<DocumentType[]> => {
  const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`)
  const documents: ReturnType<DocumentTypeFromServer[]> = useLoadFromEndpoint(url)
  return transformArticle(documents)
}

export default useLoadDocuments
