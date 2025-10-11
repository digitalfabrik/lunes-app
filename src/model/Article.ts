export type ArticleType = {
  readonly id: number
  readonly value: string
}

export const ARTICLES = [
  {
    id: 0,
    value: 'keiner',
  },
  {
    id: 1,
    value: 'der',
  },
  {
    id: 2,
    value: 'die',
  },
  {
    id: 3,
    value: 'das',
  },
  {
    id: 4,
    value: 'die',
  },
] as const

export type ArticleTypeExtended = {
  readonly label: string
} & ArticleType

export const getArticleWithLabel = (): ArticleTypeExtended[] =>
  ARTICLES.filter(article => article.id !== 0).map(article => {
    if (article.id === 4) {
      return { ...article, label: `${article.value} (Plural)` }
    }
    return { ...article, label: article.value }
  })

type Article = (typeof ARTICLES)[number]

export default Article
