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
}

export interface IAnswerSectionProps {
  count: number;
  index: number;
  setIndex: Function;
  currentWordNumber: number;
  setCurrentWordNumber: Function;
  document?: IDocumentProps;
  setDocuments: Function;
  increaseProgress: Function;
}

export interface IFeedbackProps {
  isCorrect: boolean;
  isIncorrect: boolean;
  almostCorrect: boolean;
  document?: IDocumentProps;
  word: string;
  article: string;
}

export interface IActionsProps {
  isCorrect: boolean;
  isIncorrect: boolean;
  isAlmostCorrect: boolean;
  checkEntry: () => void;
  markAsIncorrect: () => void;
  getNextWordAndModifyCounter: () => void;
  addToTryLater: () => void;
  input: string;
}
