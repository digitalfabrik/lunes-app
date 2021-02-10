import {
  React,
  styles,
  View,
  Text,
  IFeedbackProps,
  CorrectIcon,
  IncorrectIcon,
  AlmostCorrectIcon,
  COLORS,
} from './imports';

const Feedback = ({
  isCorrect,
  almostCorrect,
  isIncorrect,
  document,
  word,
  article,
}: IFeedbackProps) => {
  const Icon = isCorrect
    ? CorrectIcon
    : isIncorrect
    ? IncorrectIcon
    : AlmostCorrectIcon;

  const messageStyle = isCorrect
    ? styles.successMessage
    : isIncorrect
    ? styles.failedMessage
    : styles.almostCorrectMessage;

  const message = isCorrect
    ? 'Great, keep it up! \nThe Word you filled in is correct.'
    : isIncorrect
    ? `What a pity! Your entry is incorrect,\nthe correct answer is: ${
        document?.article === 'die (Plural)' ? 'die' : document?.article
      } ${document?.word}`
    : `Your entry ${article} ${word} is almost correct.\nCheck for upper and lower case.`;

  return isCorrect || isIncorrect || almostCorrect ? (
    <View style={[styles.messageContainer, messageStyle]}>
      <Icon fill={COLORS.lunesGreyDark} stroke={COLORS.lunesGreyDark} />
      <View style={styles.textContainer}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.text}>
          {message}
        </Text>
      </View>
    </View>
  ) : null;
};

export default Feedback;
