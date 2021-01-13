import {IIconsProps, IProfessionsProps} from '../interfaces/profession';

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
