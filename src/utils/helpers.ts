import { IProfessionSubcategoryProps } from '../interfaces/professionSubcategory'
import { COLORS } from '../constants/colors'
import { ARTICLES } from '../constants/data'

export const getProfessionSubcategoryWithIcon = (
  icon: string,
  professionSubcategoriesList: IProfessionSubcategoryProps[]
): IProfessionSubcategoryProps[] => {
  const mappedProfessionSubcategories: IProfessionSubcategoryProps[] = professionSubcategoriesList.map(subcategory => {
    subcategory.icon = icon
    return subcategory
  })

  return mappedProfessionSubcategories
}

export const getArticleColor = (article: string): string => {
  switch (article?.toLowerCase()) {
    case ARTICLES.der:
      return COLORS.lunesArtikelDer

    case ARTICLES.das:
      return COLORS.lunesArtikelDas

    case ARTICLES.die:
      return COLORS.lunesArtikelDie

    case ARTICLES.diePlural:
      return COLORS.lunesArtikelDiePlural

    default:
      return COLORS.lunesArtikelDer
  }
}

export const capitalizeFirstLetter = (article: string): string => {
  return article.charAt(0).toUpperCase() + article.slice(1)
}
