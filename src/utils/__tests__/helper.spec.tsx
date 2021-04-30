import { getArticleColor, capitalizeFirstLetter } from '../helpers'
import { COLORS } from '../../constants/colors'
import { ARTICLES } from '../../constants/data'

describe('Utils: helpers', () => {
  describe('getArticleColor', () => {
    it('should return lunesArtikelDer color when article is der', () => {
      // preparation
      const article = ARTICLES.der
      // execution
      const articleColor = getArticleColor(article)
      // assertion
      expect(articleColor).toBe(COLORS.lunesArtikelDer)
    })

    it('should return lunesArtikelDie color when article is die', () => {
      const article = ARTICLES.die
      const articleColor = getArticleColor(article)

      expect(articleColor).toBe(COLORS.lunesArtikelDie)
    })

    it('should return lunesArtikelDas color when article is das', () => {
      const article = ARTICLES.das
      const articleColor = getArticleColor(article)

      expect(articleColor).toBe(COLORS.lunesArtikelDas)
    })

    it('should return lunesArtikelDiePlural color when article is die (plural)', () => {
      const article = ARTICLES.diePlural
      const articleColor = getArticleColor(article)

      expect(articleColor).toBe(COLORS.lunesArtikelDiePlural)
    })

    it('should return lunesArtikelDer color when article is empty', () => {
      const article = ''
      const articleColor = getArticleColor(article)

      expect(articleColor).toBe(COLORS.lunesArtikelDer)
    })

    it('should return lunesArtikelDer color when article is undefined', () => {
      const article = undefined as any
      const articleColor = getArticleColor(article)

      expect(articleColor).toBe(COLORS.lunesArtikelDer)
    })
  })

  describe('capitalizeFirstLetter', () => {
    it('should return the word passed to it with the first letter being capitalized', () => {
      const word = 'word'
      const result = capitalizeFirstLetter(word)

      expect(result).toBe('Word')
    })

    it('should return empty string when passing empty string', () => {
      const word = ''
      const result = capitalizeFirstLetter(word)

      expect(result).toBe('')
    })
  })
})
