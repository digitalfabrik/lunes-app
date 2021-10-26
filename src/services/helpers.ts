import { Article } from '../constants/data'
import { DocumentType } from '../constants/endpoints'
import { COLORS } from '../constants/theme/colors'

export const getArticleColor = (article: Article): string => {
  switch (article.id) {
    case 1:
      return COLORS.lunesArtikelDer

    case 2:
      return COLORS.lunesArtikelDas

    case 3:
      return COLORS.lunesArtikelDie

    case 4:
      return COLORS.lunesArtikelDiePlural

    default:
      return COLORS.lunesArtikelDer
  }
}

export const appendDocument = (documents: DocumentType[], currentDocument: number): DocumentType[] => {
  const currDocument = documents[currentDocument]
  const newDocuments = documents.filter(d => d !== currDocument)
  newDocuments.push(currDocument)
  return newDocuments
}
