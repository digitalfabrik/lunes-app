import {
  easy,
  hard,
  CorrectIcon,
  IncorrectIcon,
  AlmostCorrectIcon,
} from '../assets/images';

export const SCREENS = {
  profession: 'Profession',
  professionSubcategory: 'ProfessionSubcategory',
  exercises: 'Exercises',
  vocabularyOverview: 'VocabularyOverview',
  vocabularyTrainer: 'VocabularyTrainer',
  initialSummaryScreen: 'InitialSummary',
  ResultsOverview: 'ResultsOverview',
  CorrectResults: 'CorrectResults',
  ResultScreen: 'ResultScreen',
  AlmostCorrectResults: 'AlmostCorrectResults',
  IncorrectResults: 'IncorrectResults',
};

export const RESULT_TYPE = ['correct', 'similar', 'incorrect'];

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
    nextScreen: SCREENS.CorrectResults,
  },
  {
    id: 2,
    title: 'Almost correct entries',
    icon: AlmostCorrectIcon,
    nextScreen: SCREENS.AlmostCorrectResults,
  },
  {
    id: 3,
    title: 'Incorrect entries',
    icon: IncorrectIcon,
    nextScreen: SCREENS.IncorrectResults,
  },
];

export const ARTICLES = {
  die: 'die',
  der: 'der',
  das: 'das',
  diePlural: 'die (plural)',
};

export const RESULT_PRESETS = {
  similar: {
    Icon: AlmostCorrectIcon,
    title: 'Almost Correct',
    next: {title: 'INCORRECT', type: 'incorrect'},
  },
  correct: {
    Icon: CorrectIcon,
    title: 'Correct',
    next: {title: 'ALMOST CORRECT', type: 'similar'},
  },
  incorrect: {
    Icon: IncorrectIcon,
    title: 'Incorrect',
    next: {title: 'CORRECT', type: 'correct'},
  },
};
