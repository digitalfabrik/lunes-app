import {
  React,
  TouchableOpacity,
  useState,
  View,
  COLORS,
  styles,
  TextInput,
  CloseIcon,
  IAnswerSectionProps,
  Popover,
  VolumeUp,
  Platform,
  SoundPlayer,
  Tts,
  AsyncStorage,
  IDocumentProps,
  Feedback,
  stringSimilarity,
  Actions,
  SCREENS,
  PopoverContent,
  useFocusEffect,
} from './imports';

const AnswerSection = ({
  count,
  index,
  setIndex,
  currentWordNumber,
  setCurrentWordNumber,
  document,
  setDocuments,
  increaseProgress,
  navigation,
}: IAnswerSectionProps) => {
  const [input, setInput] = useState('');
  const touchable: any = React.createRef();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [incorrectDocuments, setIncorrectDocuments] = useState<
    IDocumentProps[]
  >([]);
  const [dataLength, setDataLength] = useState(count); //for try later documents array
  const [tryLaterDocuments, setTryLaterDocuments] = useState<IDocumentProps[]>(
    [],
  );
  const [isTryLater, setIsTryLater] = useState(false); //repeat try later documents
  const [isCorrect, setIsCorrect] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [correctDocuments, setCorrectDocuments] = useState<IDocumentProps[]>(
    [],
  );
  const [word, setWord] = useState('');
  const [documentArticle, setArticle] = useState('');
  const [isAlmostCorrect, setIsAlmostCorrect] = useState(false);
  const [almostCorrectDocuments, setAlmostCorrectDocuments] = useState<
    IDocumentProps[]
  >([]);
  const [isFinished, setIsFinished] = useState(false);

  const borderColor = isCorrect
    ? COLORS.lunesFunctionalCorrectDark
    : isIncorrect
    ? COLORS.lunesFunctionalIncorrectDark
    : isAlmostCorrect
    ? COLORS.lunesFunctionalAlmostCorrectDark
    : input
    ? COLORS.lunesBlack
    : COLORS.lunesGreyMedium;

  const volumeIconColor =
    !isCorrect && !isIncorrect
      ? COLORS.lunesBlackUltralight
      : isActive
      ? COLORS.lunesRedDark
      : COLORS.lunesRed;

  const clearTextInput = () => {
    setInput('');
  };

  const modifyHeaderCounter = () => {
    if (currentWordNumber < count) {
      setCurrentWordNumber(currentWordNumber + 1);
    }
  };

  const getNextWord = () => {
    if (index < dataLength - 1) {
      setIndex(index + 1);
    } else {
      if (currentWordNumber !== count) {
        setIsTryLater(true);
      }
    }
  };

  const modifyStates = (
    newIsCorrect: boolean,
    newIsIncorrect: boolean,
    newIsAlmostCorrect: boolean,
    newDocument?: IDocumentProps,
    setState?: Function,
  ) => {
    setIsCorrect(newIsCorrect);
    setIsIncorrect(newIsIncorrect);
    setIsAlmostCorrect(newIsAlmostCorrect);
    if (newDocument) {
      setState &&
        setState((oldDocuments: IDocumentProps[]) => [
          ...oldDocuments,
          newDocument,
        ]);
    }
  };

  const checkIfLastWord = () => {
    if (currentWordNumber === count) {
      setIsFinished(true);
    }
  };

  const validateForCorrect = (inputArticle: string, inputWord: string) => {
    let correct: boolean | undefined = false;

    if (inputArticle === document?.article && inputWord === document?.word) {
      correct = true;
    } else {
      correct = document?.alternatives?.some(
        ({article, alt_word}) =>
          inputArticle === article && inputWord === alt_word,
      );
    }

    if (document && correct) {
      modifyStates(true, false, false, document, setCorrectDocuments);

      checkIfLastWord();
    }

    return correct;
  };

  const validateForSimilar = (inputArticle: string, inputWord: string) => {
    if (isAlmostCorrect && document) {
      modifyStates(false, true, false, document, setAlmostCorrectDocuments);
      checkIfLastWord();
      return true;
    } else {
      let similar: boolean | undefined = false;

      if (
        document &&
        inputArticle === document.article &&
        stringSimilarity.compareTwoStrings(inputWord, document.word) > 0.4
      ) {
        similar = true;
      } else {
        similar = document?.alternatives?.some(
          ({article, alt_word}) =>
            inputArticle === article &&
            stringSimilarity.compareTwoStrings(inputWord, alt_word) > 0.4,
        );
      }

      if (similar) {
        modifyStates(false, false, true);
      }

      return similar;
    }
  };

  const validateForIncorrect = () => {
    if (document) {
      modifyStates(false, true, false, document, setIncorrectDocuments);

      checkIfLastWord();
    }
  };

  const validateInput = (inputArticle: string, inputWord: string) => {
    if (!validateForCorrect(inputArticle, inputWord)) {
      if (!validateForSimilar(inputArticle, inputWord)) {
        validateForIncorrect();
      }
    }
  };

  const checkEntry = () => {
    const splitInput = input.trim().split(' ');

    if (splitInput.length < 2) {
      setIsPopoverVisible(true);
    } else {
      let inputArticle = splitInput[0];
      let inputWord = splitInput[1];
      setWord(inputWord);
      setArticle(inputArticle);

      validateInput(inputArticle.toLowerCase(), inputWord);
    }
  };

  const markAsIncorrect = () => {
    if (document) {
      setIncorrectDocuments((oldDocuments) => [...oldDocuments, document]);
    }

    if (currentWordNumber === count) {
      handleCheckOutClick();
    } else {
      getNextWordAndModifyCounter();
    }
  };

  const addToTryLater = () => {
    if (document) {
      setTryLaterDocuments((oldDocuments) => [...oldDocuments, document]);
    }
    getNextWord();
  };

  const handleSpeakerClick = (audio?: string) => {
    setIsActive(true);

    // Don't use soundplayer for IOS, since IOS doesn't support .ogg files
    if (audio && Platform.OS !== 'ios') {
      //audio from API
      SoundPlayer.playUrl(document?.audio);
    } else {
      Tts.speak(document?.word, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    }
  };

  const getNextWordAndModifyCounter = () => {
    getNextWord();
    modifyHeaderCounter();
    modifyStates(false, false, false);
  };

  const handleCheckOutClick = () => {
    navigation.navigate(SCREENS.initialSummaryScreen);
  };

  const resetStates = () => {
    setCorrectDocuments([]);
    setIncorrectDocuments([]);
    setAlmostCorrectDocuments([]);
    setTryLaterDocuments([]);
    setIsCorrect(false);
    setIsIncorrect(false);
    setIsTryLater(false);
    setIsAlmostCorrect(false);
    setIsFinished(false);
    setInput('');
  };

  useFocusEffect(
    React.useCallback(() => {
      resetStates();
    }, []),
  );

  React.useEffect(() => {
    let _onSoundPlayerFinishPlaying: any = null;
    let _onTtsFinishPlaying: any = null;

    _onSoundPlayerFinishPlaying = SoundPlayer.addEventListener(
      'FinishedPlaying',
      () => {
        setIsActive(false);
      },
    );

    _onTtsFinishPlaying = Tts.addEventListener('tts-finish', () =>
      setIsActive(false),
    );

    return () => {
      _onSoundPlayerFinishPlaying.remove();
      _onTtsFinishPlaying.remove();
    };
  }, []);

  React.useEffect(() => {
    AsyncStorage.setItem('incorrect', JSON.stringify(incorrectDocuments));
    AsyncStorage.setItem('correct', JSON.stringify(correctDocuments));
    AsyncStorage.setItem(
      'almost correct',
      JSON.stringify(almostCorrectDocuments),
    );

    // This is just for testing
    AsyncStorage.getItem('incorrect').then((value) =>
      console.log('incorrect', value && JSON.parse(value)),
    );

    // This is just for testing
    AsyncStorage.getItem('correct').then((value) =>
      console.log('correct', value && JSON.parse(value)),
    );

    // This is just for testing
    AsyncStorage.getItem('almost correct').then((value) =>
      console.log('almost correct', value && JSON.parse(value)),
    );
  }, [incorrectDocuments, correctDocuments, almostCorrectDocuments]);

  React.useEffect(() => {
    clearTextInput();
  }, [index]);

  React.useEffect(() => {
    setDataLength(count);
  }, [count]);

  React.useEffect(() => {
    if (isTryLater) {
      setIndex(0);
      setDocuments(tryLaterDocuments);
      setDataLength(tryLaterDocuments.length);
      setTryLaterDocuments([]);
      setIsTryLater(false);
    }
  }, [isTryLater, setIndex, setDocuments, tryLaterDocuments]);

  React.useEffect(() => {
    if (isCorrect) {
      increaseProgress();
    }
  }, [isCorrect, increaseProgress]);

  React.useEffect(() => {
    if (isAlmostCorrect) {
      clearTextInput();
    }
  }, [isAlmostCorrect]);

  return (
    <View style={styles.container}>
      <Popover
        isVisible={isPopoverVisible}
        setIsPopoverVisible={setIsPopoverVisible}
        ref={touchable}>
        <PopoverContent />
      </Popover>

      <TouchableOpacity
        disabled={isCorrect || isIncorrect ? false : true}
        style={styles.volumeIcon}
        onPress={() => handleSpeakerClick(document?.audio)}>
        <VolumeUp fill={volumeIconColor} />
      </TouchableOpacity>

      <View
        ref={touchable}
        style={[
          styles.textInputContainer,
          {
            borderColor: borderColor,
          },
        ]}>
        <TextInput
          style={styles.textInput}
          placeholder={
            isAlmostCorrect ? 'Try again' : 'Enter Word with article'
          }
          placeholderTextColor={COLORS.lunesBlackLight}
          value={input}
          onChangeText={(text) => setInput(text)}
          editable={!isCorrect && !isIncorrect}
        />
        {!!input && !isCorrect && !isIncorrect && (
          <TouchableOpacity onPress={clearTextInput}>
            <CloseIcon />
          </TouchableOpacity>
        )}
      </View>

      <Feedback
        isCorrect={isCorrect}
        isIncorrect={isIncorrect}
        almostCorrect={isAlmostCorrect}
        document={document}
        word={word}
        article={documentArticle}
      />

      <Actions
        input={input}
        isCorrect={isCorrect}
        isIncorrect={isIncorrect}
        isAlmostCorrect={isAlmostCorrect}
        checkEntry={checkEntry}
        addToTryLater={addToTryLater}
        getNextWordAndModifyCounter={getNextWordAndModifyCounter}
        markAsIncorrect={markAsIncorrect}
        isFinished={isFinished}
        checkOut={handleCheckOutClick}
      />
    </View>
  );
};

export default AnswerSection;
