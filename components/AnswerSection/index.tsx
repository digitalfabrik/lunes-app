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
} from './imports';

const AnswerSection = ({
  count,
  index,
  setIndex,
  currentWordNumber,
  setCurrentWordNumber,
  document,
}: IAnswerSectionProps) => {
  const [word, setWord] = useState('');
  const touchable: any = React.useRef();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isValidEntry, setIsValidEntry] = useState(false);

  const clearTextInput = () => {
    setWord('');
    setIsValidEntry(false);
  };

  const getNextWord = () => {
    if (index < count - 1) {
      setIndex(index + 1);
      setCurrentWordNumber(currentWordNumber + 1);
    }
  };

  const checkEntry = () => {
    if (word.trim().split(' ').length < 2) {
      setIsPopoverVisible(true);
      setIsValidEntry(false);
    } else {
      setIsValidEntry(true);
      setIsActive(true);
      handlaSpeakerClick(document?.audio);
    }
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

      {/* this is disabled for now, until finish implementing the logic */}
      <TouchableOpacity
        disabled={!word}
        style={styles.volumeIcon}
        onPress={() => handlaSpeakerClick(document?.audio)}>
        {isValidEntry && word ? (
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
        style={[styles.textInputContainer, !!word && styles.activeTextInput]}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Word with article"
          placeholderTextColor={COLORS.lunesBlackLight}
          value={word}
          onChangeText={(text) => setWord(text)}
        />
        {!!word && (
          <TouchableOpacity onPress={clearTextInput}>
            <CloseIcon />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={checkEntry}
        disabled={!word}
        style={[styles.checkEntryButton, !word && styles.disabledButton]}>
        <Text
          style={[styles.checkEntryLabel, !word && styles.disabledButtonLabel]}>
          Check entry
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.giveUpButton}>
        <Text style={styles.giveUpLabel}>I give up!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tryLaterButton} onPress={getNextWord}>
        <Text style={styles.giveUpLabel}>Try later</Text>
        <NextArrow />
      </TouchableOpacity>
    </View>
  );
};

export default AnswerSection;
