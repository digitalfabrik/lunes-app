export interface IVocabularyOverviewScreen {
  navigation: any;
  route: any;
}

export interface IVocabularyTrainerScreen {
  navigation: any;
  route: any;
}

export interface IDocumentProps {
  id: number;
  word: string;
  article: string;
  image: string;
}

export interface IVocabularyOverviewListItemProps {
  id: number;
  word: string;
  article: string;
  image: any;
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
}
