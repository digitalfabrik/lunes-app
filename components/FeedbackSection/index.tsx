import {
  React,
  styles,
  View,
  Text,
  IFeedbackProps,
  CorrectIcon,
  IncorrectIcon,
  AlmostCorrectIcon,
} from './imports';

const Feedback = ({
  isCorrect,
  almostCorrect,
  isIncorrect,
  document,
  word,
  article,
}: IFeedbackProps) => (  
  <View style={styles.container}>
    {isCorrect && (
      <View style={[styles.messageContainer, styles.successMessage]}>
        <CorrectIcon />
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Great, keep it up!{'\n'}
            The Word you filled in is correct.
          </Text>
        </View>
      </View>
    )}

    {isIncorrect && (
      <View style={[styles.messageContainer, styles.failedMessage]}>
        <IncorrectIcon />
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            What a pity! Your entry is incorrect,{'\n'}
            {`the correct answer is: ${document?.article === 'die (Plural)' ? 'die' : document?.article} ${document?.word}`}
          </Text>
        </View>
      </View>
    )}

    {almostCorrect && (
      <View style={[styles.messageContainer, styles.almostCorrectMessage]}>
        <AlmostCorrectIcon />
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {`Your entry ${article} ${word} is almost correct.\n`}
            Check for upper and lower case.
          </Text>
        </View>
      </View>
    )}
  </View>
);

export default Feedback;
