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
  Feedback,
  stringSimilarity,
  Actions,
  PopoverContent,
  AsyncStorage,
} from './imports';

const AnswerSection = ({
  currentDocumentNumber,
  setCurrentDocumentNumber,
  finishExercise,
  tryLater,
  trainingSet,
  disciplineTitle,
  documents,
}: IAnswerSectionProps) => {
  const touchable: any = React.createRef();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState('');
  const [submission, setSubmission] = useState('');
  const [result, setResult] = useState('');
  const [secondAttempt, setSecondAttempt] = useState(false);
  const document = documents[currentDocumentNumber];
  const totalNumbers = documents.length;

  React.useEffect(() => {
    const _onSoundPlayerFinishPlaying = SoundPlayer.addEventListener(
      'FinishedPlaying',
      () => setIsActive(false),
    );

    const _onTtsFinishPlaying = Tts.addEventListener('tts-finish', () =>
      setIsActive(false),
    );

    return () => {
      _onSoundPlayerFinishPlaying.remove();
      _onTtsFinishPlaying.remove();
    };
  }, []);

  const checkEntry = () => {
    setSubmission(input);
    const splitInput = input.trim().split(' ');

    if (splitInput.length < 2) {
      setIsPopoverVisible(true);
      return;
    }

    const article = splitInput[0].toLowerCase();
    const word = splitInput[1];

    if (!validateForSimilar(article, word)) {
      setResult('incorrect');
      storeResult();
    } else if (validateForCorrect(article, word)) {
      setResult('correct');
      storeResult();
    } else if (secondAttempt) {
      setResult('incorrect');
      storeResult();
    } else {
      setInput('');
      setSecondAttempt(true);
      return;
    }
    setSecondAttempt(false);
  };

  const validateForCorrect = (inputArticle: string, inputWord: string) => {
    const exactAnswer =
      inputArticle === document?.article && inputWord === document?.word;

    const altAnswer = document?.alternatives?.some(
      ({article, alt_word}) =>
        inputArticle === article && inputWord === alt_word,
    );
    return exactAnswer || altAnswer;
  };

  const validateForSimilar = (inputArticle: string, inputWord: string) => {
    const origCheck =
      document &&
      inputArticle === document.article &&
      stringSimilarity.compareTwoStrings(inputWord, document.word) > 0.4;

    const altCheck = document?.alternatives?.some(
      ({article, alt_word}) =>
        inputArticle === article &&
        stringSimilarity.compareTwoStrings(inputWord, alt_word) > 0.4,
    );
    return origCheck || altCheck;
  };

  const getNextWord = () => {
    setResult('');
    setInput('');
    setSecondAttempt(false);
    storeResult();

    if (currentDocumentNumber === totalNumbers - 1) {
      finishExercise();
    }
    setCurrentDocumentNumber(currentDocumentNumber + 1);
  };

  const storeResult = () => {
    AsyncStorage.getItem('Vocabulary Trainer').then(async (value) => {
      let jsonValue = value ? JSON.parse(value) : {};

      if (!jsonValue?.[disciplineTitle]?.[trainingSet]) {
        if (!jsonValue?.[disciplineTitle]) {
          jsonValue[disciplineTitle] = {};
        }
        jsonValue[disciplineTitle][trainingSet] = {};
      }

      if (document) {
        jsonValue[disciplineTitle][trainingSet][document.word] = result
          ? {...document, result}
          : {...document, result: 'incorrect'};
      }

      await AsyncStorage.setItem(
        'Vocabulary Trainer',
        JSON.stringify(jsonValue),
      );

      await AsyncStorage.getItem('session').then(async (session) => {
        const jsValue = JSON.parse(session);
        const newData = JSON.stringify({
          ...jsValue,
          retryData: {
            data: documents.slice(currentDocumentNumber + 1, totalNumbers),
          },
        });
        AsyncStorage.setItem('session', newData);
      });
    });
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

  const getBorderColor = () => {
    if (!secondAttempt && !input) {
      return COLORS.lunesGreyMedium;
    } else if (result === 'similar' || secondAttempt) {
      return COLORS.lunesFunctionalAlmostCorrectDark;
    } else if (result === 'correct') {
      return COLORS.lunesFunctionalCorrectDark;
    } else if (result === 'incorrect') {
      return COLORS.lunesFunctionalIncorrectDark;
    } else {
      return COLORS.lunesBlack;
    }
  };

  const volumeIconColor =
    result === ''
      ? COLORS.lunesBlackUltralight
      : isActive
      ? COLORS.lunesRedDark
      : COLORS.lunesRed;

  return (
    <View style={styles.container}>
      <Popover
        isVisible={isPopoverVisible}
        setIsPopoverVisible={setIsPopoverVisible}
        ref={touchable}>
        <PopoverContent />
      </Popover>

      <TouchableOpacity
        testID="volume-button"
        disabled={result === ''}
        style={styles.volumeIcon}
        onPress={() => handleSpeakerClick(document?.audio)}>
        <VolumeUp fill={volumeIconColor} />
      </TouchableOpacity>

      <View
        testID="input-field"
        ref={touchable}
        style={[
          styles.textInputContainer,
          {
            borderColor: getBorderColor(),
          },
        ]}>
        <TextInput
          style={styles.textInput}
          placeholder={secondAttempt ? 'Try again' : 'Enter Word with article'}
          placeholderTextColor={COLORS.lunesBlackLight}
          value={input}
          onChangeText={(text) => setInput(text)}
          editable={result === ''}
        />
        {result === '' && input !== '' && (
          <TouchableOpacity onPress={() => setInput('')}>
            <CloseIcon />
          </TouchableOpacity>
        )}
      </View>

      <Feedback
        secondAttempt={secondAttempt}
        result={result}
        document={document}
        input={submission}
      />

      <Actions
        tryLater={tryLater}
        giveUp={getNextWord}
        input={input}
        result={result}
        checkEntry={checkEntry}
        getNextWord={getNextWord}
        secondAttempt={secondAttempt}
        isFinished={currentDocumentNumber === totalNumbers - 1}
      />
    </View>
  );
};

export default AnswerSection;
