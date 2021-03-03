import {
  getArticleColor,
  getProfessionSubcategoryWithIcon,
} from '../../utils/helpers';
import {COLORS} from '../../constants/colors';
import {ARTICLES} from '../../constants/data';
import {IProfessionSubcategoryProps} from '../../interfaces/professionSubcategory';

describe('Utils: helpers', () => {
  describe('getArticleColor', () => {
    it('should return lunesArtikelDer color when article is der', () => {
      // preparation
      const article = ARTICLES.der;
      // execution
      const articleColor = getArticleColor(article);
      // assertion
      expect(articleColor).toBe(COLORS.lunesArtikelDer);
    });

    it('should return lunesArtikelDie color when article is die', () => {
      const article = ARTICLES.die;
      const articleColor = getArticleColor(article);

      expect(articleColor).toBe(COLORS.lunesArtikelDie);
    });

    it('should return lunesArtikelDas color when article is das', () => {
      const article = ARTICLES.das;
      const articleColor = getArticleColor(article);

      expect(articleColor).toBe(COLORS.lunesArtikelDas);
    });

    it('should return lunesArtikelDiePlural color when article is die (plural)', () => {
      const article = ARTICLES.diePlural;
      const articleColor = getArticleColor(article);

      expect(articleColor).toBe(COLORS.lunesArtikelDiePlural);
    });

    it('should return lunesArtikelDer color when article is empty', () => {
      const article = '';
      const articleColor = getArticleColor(article);

      expect(articleColor).toBe(COLORS.lunesArtikelDer);
    });

    it('should return lunesArtikelDer color when article is undefined', () => {
      const article = undefined as any;
      const articleColor = getArticleColor(article);

      expect(articleColor).toBe(COLORS.lunesArtikelDer);
    });
  });

  describe('getProfessionSubcategoryWithIcon', () => {
    it('should return subcategories with icon passed to it', () => {
      const icon = 'icon_url';
      const subCategories: IProfessionSubcategoryProps[] = [
        {
          id: 0,
          title: 'sub1',
          description: 'with icon',
          total_documents: 2,
          icon: '',
        },
        {
          id: 1,
          title: 'sub2',
          description: 'with icon',
          total_documents: 3,
          icon: '',
        },
      ];
      const subCategoriesWithIcon = getProfessionSubcategoryWithIcon(
        icon,
        subCategories,
      );
      const result: IProfessionSubcategoryProps[] = [
        {
          id: 0,
          title: 'sub1',
          description: 'with icon',
          total_documents: 2,
          icon: 'icon_url',
        },
        {
          id: 1,
          title: 'sub2',
          description: 'with icon',
          total_documents: 3,
          icon: 'icon_url',
        },
      ];

      expect(subCategoriesWithIcon).toStrictEqual(result);
    });

    it('should return empty array when subcategories array is empty', () => {
      const icon = 'icon_url';
      const subCategories: IProfessionSubcategoryProps[] = [];
      const subCategoriesWithIcon = getProfessionSubcategoryWithIcon(
        icon,
        subCategories,
      );
      const result: IProfessionSubcategoryProps[] = [];

      expect(subCategoriesWithIcon).toStrictEqual(result);
    });
  });
});
