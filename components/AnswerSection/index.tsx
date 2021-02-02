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
  PopoverPlacement,
  PopoverContent,
  VolumeUpDisabled,
  InActiveVolumeUp,
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
  const touchable: any = React.useRef();
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
  const [article, setArticle] = useState('');
  const [isAlmostCorrect, setIsAlmostCorrect] = useState(false);
  const [almostCorrectDocuments, setAlmostCorrectDocuments] = useState<
    IDocumentProps[]
  >([]);
  const [isFinished, setIsFinished] = useState(false);

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

  const validateForCorrect = (
    inputArticle: string,
    inputWord: string,
  ): boolean => {
    let correct: boolean = false;

    if (inputArticle == document?.article && inputWord === document?.word) {
      correct = true;
    } else {
      document?.alternatives?.forEach((alternative) => {
        if (
          inputArticle == alternative.article &&
          inputWord === alternative.alt_word
        ) {
          correct = true;
          return;
        }
      });
    }

    if (document && correct) {
      setIsCorrect(true);
      setIsIncorrect(false);
      setIsAlmostCorrect(false);
      setCorrectDocuments((oldDocuments) => [...oldDocuments, document]);

      if (currentWordNumber === count) {
        setIsFinished(true);
      }
    }

    return correct;
  };

  const validateForSimilar = (
    inputArticle: string,
    inputWord: string,
  ): boolean => {
    if (isAlmostCorrect && document) {
      setIsCorrect(false);
      setIsIncorrect(true);
      setIsAlmostCorrect(false);
      setAlmostCorrectDocuments((oldDocuments) => [...oldDocuments, document]);
      return true;
    } else {
      let similar: boolean = false;

      if (
        document &&
        inputArticle === document.article &&
        stringSimilarity.compareTwoStrings(inputWord, document.word) > 0.4
      ) {
        similar = true;
      } else {
        document?.alternatives?.forEach((alternative) => {
          if (
            inputArticle == alternative.article &&
            stringSimilarity.compareTwoStrings(
              inputWord,
              alternative.alt_word,
            ) > 0.4
          ) {
            similar = true;
            return;
          }
        });
      }

      if (similar && document) {
        setIsCorrect(false);
        setIsIncorrect(false);
        setIsAlmostCorrect(true);
      }

      return similar;
    }
  };

  const validateForIncorrect = () => {
    if (document) {
      setIsCorrect(false);
      setIsIncorrect(true);
      setIsAlmostCorrect(false);
      setIncorrectDocuments((oldDocuments) => [...oldDocuments, document]);

      if (currentWordNumber === count) {
        setIsFinished(true);
      }
    }
  };

  const checkEntry = () => {
    if (input.trim().split(' ').length < 2) {
      setIsPopoverVisible(true);
    } else {
      let inputArticle = input.trim().split(' ')[0];
      let inputWord = input.trim().split(' ')[1];
      setWord(inputWord);
      setArticle(inputArticle);

      if (!validateForCorrect(inputArticle.toLowerCase(), inputWord)) {
        if (!validateForSimilar(inputArticle.toLowerCase(), inputWord)) {
          validateForIncorrect();
        }
      }
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

  const handlaSpeakerClick = (audio?: string) => {
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
    setIsCorrect(false);
    setIsIncorrect(false);
    setIsAlmostCorrect(false);
  };

  const handleCheckOutClick = () => {
    navigation.navigate(SCREENS.initialSummaryScreen);
  };

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
        onRequestClose={() => setIsPopoverVisible(false)}
        from={touchable}
        placement={PopoverPlacement.TOP}
        arrowStyle={styles.arrow}
        arrowShift={-0.8}
        verticalOffset={-10}
        backgroundStyle={styles.overlay}>
        <PopoverContent />
      </Popover>

      <TouchableOpacity
        disabled={isCorrect || isIncorrect ? false : true}
        style={styles.volumeIcon}
        onPress={() => handlaSpeakerClick(document?.audio)}>
        {isCorrect || isIncorrect ? (
          isActive ? (
            <VolumeUp />
          ) : (
            <InActiveVolumeUp />
          )
        ) : (
          <VolumeUpDisabled />
        )}
      </TouchableOpacity>

      <View
        ref={touchable}
        style={[
          styles.textInputContainer,
          {
            borderColor: isCorrect
              ? COLORS.lunesFunctionalCorrectDark
              : isIncorrect
              ? COLORS.lunesFunctionalIncorrectDark
              : isAlmostCorrect
              ? COLORS.lunesFunctionalAlmostCorrectDark
              : input
              ? COLORS.lunesBlack
              : COLORS.lunesGreyMedium,
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
        article={article}
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
