import { Article } from '../constants/data'
import { AlternativeWordType, DisciplineType, DocumentType } from '../constants/endpoints'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'

export const stringifyDocument = ({ article, word }: DocumentType | AlternativeWordType): string =>
  `${article.value} ${word}`

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

export const moveToEnd = <T>(array: T[], index: number): T[] => {
  const currDocument = array[index]
  const newDocuments = array.filter(d => d !== currDocument)
  newDocuments.push(currDocument)
  return newDocuments
}

// fix ios issue for Django, that requires trailing slash in request url https://github.com/square/retrofit/issues/1037
export const addTrailingSlashToUrl = (url: string): string => {
  return url.endsWith('/') ? url : `${url}/`
}

export const childrenLabel = (discipline: DisciplineType): string => {
  const isSingular = discipline.numberOfChildren === 1
  if (discipline.isRoot) {
    return isSingular ? labels.general.rootDiscipline : labels.general.rootDisciplines
  }
  if (discipline.isLeaf) {
    return isSingular ? labels.general.word : labels.general.words
  }
  return isSingular ? labels.general.discipline : labels.general.disciplines
}

export const childrenDescription = (discipline: DisciplineType): string =>
  `${discipline.numberOfChildren} ${childrenLabel(discipline)}`

/**
 * Shuffles an array using the Durstenfeld algorithm as found here: https://stackoverflow.com/a/12646864
 * @returns {T[]} Returns the shuffled array.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}
