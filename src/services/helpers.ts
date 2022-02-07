import { Article } from '../constants/data'
import { AlternativeWord, Discipline, Document } from '../constants/endpoints'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'

export const stringifyDocument = ({ article, word }: Document | AlternativeWord): string => `${article.value} ${word}`

export const getArticleColor = (article: Article): string => {
  switch (article.id) {
    case 1:
      return COLORS.lunesArtikelDer

    case 2:
      return COLORS.lunesArtikelDie

    case 3:
      return COLORS.lunesArtikelDas

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
export const addTrailingSlashToUrl = (url: string): string => (url.endsWith('/') ? url : `${url}/`)

export const childrenLabel = (discipline: Discipline): string => {
  const isSingular = discipline.numberOfChildren === 1
  if (!discipline.parentTitle) {
    return isSingular ? labels.general.rootDiscipline : labels.general.rootDisciplines
  }
  if (discipline.isLeaf) {
    return isSingular ? labels.general.word : labels.general.words
  }
  return isSingular ? labels.general.discipline : labels.general.disciplines
}

export const childrenDescription = (discipline: Discipline): string =>
  `${discipline.numberOfChildren} ${childrenLabel(discipline)}`

export const shuffleArray = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    // eslint-disable-next-line no-param-reassign
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}
