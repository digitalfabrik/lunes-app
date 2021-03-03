export interface IVocabularyOverviewScreen {
  navigation: any;
  route: any;
}

export interface IVocabularyTrainerScreen {
  navigation: any;
  route: any;
}

export interface IAlternativeWordProps {
  alt_word: string;
  article: string;
}

export interface IDocumentProps {
  id: number;
  word: string;
  article: string;
  image: string;
  audio: string;
  alternatives: IAlternativeWordProps[];
}

export interface IVocabularyOverviewListItemProps {
  id: number;
  word: string;
  article: string;
  image: string;
  audio: string;
}

export interface IConfirmationModalProps {
  visible: boolean;
  setIsModalVisible: Function;
  navigation: any;
  extraParams: any;
}

export interface IAnswerSectionProps {
  tryLater: () => void;
  currentDocumentNumber: number;
  setCurrentDocumentNumber: Function;
  documents: IDocumentProps[];
  finishExercise: Function;
  trainingSet: string;
  disciplineTitle: string;
}

export interface IFeedbackProps {
  secondAttempt: boolean;
  result: string;
  document?: IDocumentProps;
  input: string;
}

export interface IActionsProps {
  tryLater: () => void;
  giveUp: () => void;
  result: string;
  checkEntry: () => void;
  getNextWord: () => void;
  input: string;
  isFinished: boolean;
  secondAttempt: boolean;
}
