import { Article } from '../constants/data'
import { AlternativeWord, Discipline, Document } from '../constants/endpoints'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'

export const stringifyDocument = ({ article, word }: Document | AlternativeWord): string => `${article.value} ${word}`

export const getArticleColor = (article: Article): string => {
  switch (article.id) {
    case 1:
      return COLORS.articleMasculine

    case 2:
      return COLORS.articleFeminine

    case 3:
      return COLORS.articleNeutral

    case 4:
      return COLORS.articlePlural

    default:
      return COLORS.articleMasculine
  }
}

export const moveToEnd = <T>(array: T[], index: number): T[] => {
  const currDocument = array[index]
  const newDocuments = array.filter(d => d !== currDocument)
  newDocuments.push(currDocument)
  return newDocuments
}

export const wordsDescription = (numberOfChildren: number): string =>
  `${numberOfChildren} ${numberOfChildren === 1 ? labels.general.word : labels.general.words}`

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

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = array
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
