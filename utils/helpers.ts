import {IProfessionSubcategoryProps} from '../interfaces/professionSubcategory';
import {COLORS} from '../constants/colors';

export const getProfessionSubcategoryWithIcon = (
  icon: string,
  professionSubcategoriesList: IProfessionSubcategoryProps[],
): IProfessionSubcategoryProps[] => {
  const mappedProfessionSubcategories: IProfessionSubcategoryProps[] = professionSubcategoriesList.map(
    (subcategory) => {
      subcategory.icon = icon;
      return subcategory;
    },
  );

  return mappedProfessionSubcategories;
};

//We still need to handle "Die plural" case
export const getArticleColor = (article: string): string => {
  switch (article.toLowerCase()) {
    case 'der':
      return COLORS.lunesArtikelDer;

    case 'das':
      return COLORS.lunesArtikelDas;

    case 'die':
      return COLORS.lunesArtikelDie;

    case 'die (plural)':
      return COLORS.lunesArtikelDiePlural;

    default:
      return COLORS.lunesArtikelDer;
  }
};
