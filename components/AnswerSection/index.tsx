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
  totalNumbers,
  currentDocumentNumber,
  setCurrentDocumentNumber,
  document,
  finishExercise,
  tryLater,
  subCategory,
  profession,
}: IAnswerSectionProps) => {
  const touchable: any = React.createRef();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [tryAgain, setTryAgain] = useState(false);
  const isAlmostCorrect = !['correct', 'incorrect'].includes(result);

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
    const splitInput = input.trim().split(' ');

    if (splitInput.length < 2) {
      setIsPopoverVisible(true);
      return;
    }

    const article = splitInput[0].toLowerCase();
    const word = splitInput[1];

    if (validateForCorrect(article, word)) {
      setResult('correct');
    } else if (validateForSimilar(article, word)) {
      if (tryAgain) {
        getNextWord();
      }
      setResult('similar');
      setTryAgain(true);
      setInput('');
    } else {
      setTryAgain(false);
      setResult('incorrect');
    }
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
    AsyncStorage.getItem('Vocabulary Trainer').then(async (value) => {
      let jsonValue = value ? JSON.parse(value) : {};
      if (!jsonValue?.[profession]?.[subCategory]) {
        if (!jsonValue?.[profession]) {
          jsonValue[profession] = {};
        }
        jsonValue[profession][subCategory] = {};
      }

      if (document) {
        jsonValue[profession][subCategory][document.word] = result
          ? {...document, result}
          : {...document, result: 'incorrect'};
      }

      await AsyncStorage.setItem(
        'Vocabulary Trainer',
        JSON.stringify(jsonValue),
      );

      if (currentDocumentNumber === totalNumbers - 1) {
        finishExercise();
      }

      setCurrentDocumentNumber(currentDocumentNumber + 1);
      setResult('');
      setInput('');
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
    switch (result) {
      case 'correct':
        return COLORS.lunesFunctionalCorrectDark;
      case 'incorrect':
        return COLORS.lunesFunctionalIncorrectDark;
      case 'similar':
        return COLORS.lunesFunctionalAlmostCorrectDark;
    }
  };

  const volumeIconColor = isAlmostCorrect
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
        disabled={isAlmostCorrect}
        style={styles.volumeIcon}
        onPress={() => handleSpeakerClick(document?.audio)}>
        <VolumeUp fill={volumeIconColor} />
      </TouchableOpacity>

      <View
        ref={touchable}
        style={[
          styles.textInputContainer,
          {
            borderColor: getBorderColor(),
          },
        ]}>
        <TextInput
          style={styles.textInput}
          placeholder={
            result === 'similar' ? 'Try again' : 'Enter Word with article'
          }
          placeholderTextColor={COLORS.lunesBlackLight}
          value={input}
          onChangeText={(text) => setInput(text)}
          editable={isAlmostCorrect}
        />
        {!!input && isAlmostCorrect && (
          <TouchableOpacity onPress={() => setInput('')}>
            <CloseIcon />
          </TouchableOpacity>
        )}
      </View>

      <Feedback result={result} document={document} input={input} />

      <Actions
        tryLater={tryLater}
        giveUp={getNextWord}
        input={input}
        result={result}
        checkEntry={checkEntry}
        getNextWord={getNextWord}
        isFinished={currentDocumentNumber === totalNumbers - 1}
      />
    </View>
  );
};

export default AnswerSection;
