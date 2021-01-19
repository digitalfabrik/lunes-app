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
} from './imports';

const AnswerSection = ({
  count,
  index,
  setIndex,
  currentWordNumber,
  setCurrentWordNumber,
}: IAnswerSectionProps) => {
  const [word, setWord] = useState('');

  const clearTextInput = () => {
    setWord('');
  };

  const getNextWord = () => {
    if (index < count - 1) {
      setIndex(index + 1);
      setCurrentWordNumber(currentWordNumber + 1);
    }
  };

  return (
    <View style={styles.container}>
      <View
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
