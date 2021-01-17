import {
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
  easy,
  hard,
} from '../assets/images/imports';

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
