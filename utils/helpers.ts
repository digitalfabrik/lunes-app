import {IIconsProps, IProfessionsProps} from '../interfaces/profession';
import {IProfessionSubcategoryProps} from '../interfaces/professionSubcategory';
import {BADGES_COLORS} from '../constants/data';

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

export const getBadgeColor = (): string => {
  const index = Math.floor(Math.random() * Math.floor(8));
  return BADGES_COLORS[index];
};
