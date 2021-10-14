import { Article } from '../constants/data'
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

/* Randomize array using Durstenfeld shuffle algorithm with O(n) complexity */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = array.slice()
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffledArray[i]
    shuffledArray[i] = shuffledArray[j]
    shuffledArray[j] = temp
  }
  return shuffledArray
}
