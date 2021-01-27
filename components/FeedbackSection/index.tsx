import {
  React,
  styles,
  TouchableOpacity,
  View,
  Text,
  IFeedbackProps,
  CorrectIcon,
  WhiteNextArrow,
  IncorrectIcon,
} from './imports';

const Feedback = ({
  isCorrect,
  isIncorrect,
  document,
  goToNextWord,
}: IFeedbackProps) => (
  <View style={styles.container}>
    {isCorrect && (
      <View style={[styles.messageContainer, styles.successMessage]}>
        <CorrectIcon />
        <View style={styles.textContainer}>
          <Text style={styles.text}>Great, keep it up!</Text>
          <Text style={styles.text}>The Word you filled in is correct.</Text>
        </View>
      </View>
    )}

    {isIncorrect && (
      <View style={[styles.messageContainer, styles.failedMessage]}>
        <IncorrectIcon />
        <View style={styles.textContainer}>
          <Text style={styles.text}>What a pity! Your entry is incorrect,</Text>
          <Text
            style={
              styles.text
            }>{`the correct word is: ${document?.word}`}</Text>
        </View>
      </View>
    )}

    <TouchableOpacity style={styles.nextWordButton} onPress={goToNextWord}>
      <Text style={styles.nextWordLabel}>Next Word</Text>
      <WhiteNextArrow />
    </TouchableOpacity>
  </View>
);

export default Feedback;
