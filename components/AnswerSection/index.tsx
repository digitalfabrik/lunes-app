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
} from './imports';

const AnswerSection = ({
  count,
  index,
  setIndex,
  currentWordNumber,
  setCurrentWordNumber,
}: IAnswerSectionProps) => {
  const [word, setWord] = useState('');
  const touchable: any = React.useRef();
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const clearTextInput = () => {
    setWord('');
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
    }
  };

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
      <TouchableOpacity disabled style={styles.volumeIcon}>
        <VolumeUpDisabled />
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
