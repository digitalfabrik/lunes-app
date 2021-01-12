//Need to be replaced with icons from API
import icon1 from '../assets/images/icon-sign-6.svg';
import icon2 from '../assets/images/icon-sign-4.svg';
import icon3 from '../assets/images/icon-sign-3.svg';
import icon4 from '../assets/images/icon-sign-2.svg';
import icon5 from '../assets/images/icon-sign-5.svg';
import easy from '../assets/images/level-easy.svg';
import hard from '../assets/images/level-hard.svg';

//Need to be replaced with icons from API
export const ICONS = [
  {
    id: 2,
    Icon: icon1,
  },
  {
    id: 3,
    Icon: icon2,
  },
  {
    id: 4,
    Icon: icon3,
  },
  {
    id: 5,
    Icon: icon4,
  },
  {
    id: 6,
    Icon: icon2,
  },
  {
    id: 7,
    Icon: icon5,
  },
];

export const SCREENS = {
  profession: 'Profession',
  professionSubcategory: 'ProfessionSubcategory',
  exercises: 'Exercises',
  vocabularyOverview: 'VocabularyOverview',
  vocabularyTrainer: 'VocabularyTrainer',
};

export const EXERCISES = [
  {
    id: 1,
    title: 'Vocabulary Overview',
    description: 'All Words',
    Level: easy,
    nextScreen: SCREENS.vocabularyOverview,
  },
  {
    id: 2,
    title: 'Vocabulary Trainer',
    description: 'Write words with articles',
    Level: hard,
    nextScreen: SCREENS.vocabularyTrainer,
  },
];
