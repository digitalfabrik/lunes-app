import { COLORS } from '../constants/colors'
import { Article, ARTICLES } from '../constants/data'

export const getArticleColor = (article: Article): string => {
  return COLORS.lunesArtikelDer
  // switch (article?.toLowerCase()) {
  //   case ARTICLES.der:
  //     return COLORS.lunesArtikelDer
  //
  //   case ARTICLES.das:
  //     return COLORS.lunesArtikelDas
  //
  //   case ARTICLES.die:
  //     return COLORS.lunesArtikelDie
  //
  //   case ARTICLES.diePlural:
  //     return COLORS.lunesArtikelDiePlural
  //
  //   default:
  //     return COLORS.lunesArtikelDer
  // }
}

export const capitalizeFirstLetter = (article: string): string => {
  return article.charAt(0).toUpperCase() + article.slice(1)
}
