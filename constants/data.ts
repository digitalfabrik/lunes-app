import {
  easy,
  hard,
  CorrectIcon,
  IncorrectIcon,
  AlmostCorrectIcon,
} from '../assets/images/imports';

export const SCREENS = {
  profession: 'Profession',
  professionSubcategory: 'ProfessionSubcategory',
  exercises: 'Exercises',
  vocabularyOverview: 'VocabularyOverview',
  vocabularyTrainer: 'VocabularyTrainer',
  initialSummaryScreen: 'InitialSummary',
  ResultsOverview: 'ResultsOverview',
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

export const BUTTONS_THEME = {
  light: 'light',
  dark: 'dark',
};

export const RESULTS = [
  {
    id: 1,
    title: 'Correct entries',
    icon: CorrectIcon,
  },
  {
    id: 2,
    title: 'Almost correct entries',
    icon: AlmostCorrectIcon,
  },
  {
    id: 3,
    title: 'Incorrect entries',
    icon: IncorrectIcon,
  },
];
