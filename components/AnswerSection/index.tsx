import {
  React,
  TouchableOpacity,
  useState,
  View,
  COLORS,
  styles,
  TextInput,
  Text,
  NextArrow,
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
}: IAnswerSectionProps) => {
  const [input, setInput] = useState('');
  const touchable: any = React.useRef();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isValidEntry, setIsValidEntry] = useState(false); //article + word
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

  const clearTextInput = () => {
    setInput('');
    setIsValidEntry(false);
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

  const validateAnswer = (article: string, word: string) => {
    if (article === document?.article && word === document?.word) {
      setIsCorrect(true);
      setIsIncorrect(false);
      setCorrectDocuments((oldDocuments) => [...oldDocuments, document]);
    } else {
      let foundCorrect: boolean = false;
      document?.alternatives?.map((alternative) => {
        if (article === alternative.article && word === alternative.alt_word) {
          foundCorrect = true;
          return;
        }
      });

      if (foundCorrect && document) {
        setCorrectDocuments((oldDocuments) => [...oldDocuments, document]);
      } else if (!foundCorrect && document) {
        setIncorrectDocuments((oldDocuments) => [...oldDocuments, document]);
      }
      setIsCorrect(foundCorrect);
      setIsIncorrect(!foundCorrect);
    }
  };

  const checkEntry = () => {
    if (input.trim().split(' ').length < 2) {
      setIsPopoverVisible(true);
      setIsValidEntry(false);
    } else {
      let article = input.trim().split(' ')[0];
      let word = input.trim().split(' ')[1];
      setIsValidEntry(true);

      validateAnswer(article, word);
    }
  };

  const markAsIncorrect = () => {
    if (document) {
      setIncorrectDocuments((oldDocuments) => [...oldDocuments, document]);
    }
    getNextWord();
    modifyHeaderCounter();
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

    // This is just for testing
    AsyncStorage.getItem('incorrect').then((value) =>
      console.log('incorrect', value && JSON.parse(value)),
    );

    // This is just for testing
    AsyncStorage.getItem('correct').then((value) =>
      console.log('correct', value && JSON.parse(value)),
    );
  }, [incorrectDocuments, correctDocuments]);

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
        disabled={!input}
        style={styles.volumeIcon}
        onPress={() => handlaSpeakerClick(document?.audio)}>
        {isValidEntry && input ? (
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
          !!input && styles.activeTextInput,
          {
            borderColor: isCorrect
              ? COLORS.lunesFunctionalCorrectDark
              : isIncorrect
              ? COLORS.lunesFunctionalIncorrectDark
              : COLORS.lunesGreyMedium,
          },
        ]}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Word with article"
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

      {isCorrect || isIncorrect ? (
        <Feedback
          isCorrect={isCorrect}
          isIncorrect={isIncorrect}
          document={document}
          goToNextWord={getNextWordAndModifyCounter}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={checkEntry}
            disabled={!input}
            style={[styles.checkEntryButton, !input && styles.disabledButton]}>
            <Text
              style={[
                styles.checkEntryLabel,
                !input && styles.disabledButtonLabel,
              ]}>
              Check entry
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.giveUpButton}
            onPress={markAsIncorrect}>
            <Text style={styles.giveUpLabel}>I give up!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tryLaterButton}
            onPress={addToTryLater}>
            <Text style={styles.giveUpLabel}>Try later</Text>
            <NextArrow />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default AnswerSection;
