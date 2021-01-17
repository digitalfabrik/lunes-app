import {IIconsProps, IProfessionsProps} from '../interfaces/profession';
import {IProfessionSubcategoryProps} from '../interfaces/professionSubcategory';
import {COLORS} from '../constants/colors';

export const getProfessionsWithIcons = (
  iconsList: IIconsProps[],
  professionsList: IProfessionsProps[],
): IProfessionsProps[] => {
  const mappedProfessions: IProfessionsProps[] = professionsList.map(
    (profession) => {
      profession.Icon = iconsList.find(
        (icon) => icon.id === profession.id,
      )?.Icon;
      return profession;
    },
  );

  return mappedProfessions;
};

export const getProfessionSubcategoryWithIcon = (
  icon: IIconsProps,
  professionSubcategoriesList: IProfessionSubcategoryProps[],
): IProfessionSubcategoryProps[] => {
  const mappedProfessionSubcategories: IProfessionSubcategoryProps[] = professionSubcategoriesList.map(
    (subcategory) => {
      subcategory.Icon = icon;
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

    default:
      return COLORS.lunesArtikelDiePlural;
  }
};
