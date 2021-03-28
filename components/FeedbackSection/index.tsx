import {
  React,
  styles,
  View,
  Text,
  IFeedbackProps,
  CorrectFeedbackIcon,
  IncorrectFeedbackIcon,
  AlmostCorrectFeedbackIcon,
  ARTICLES,
} from './imports';

const Feedback = ({result, document, input, secondAttempt}: IFeedbackProps) => {
  const Icon =
    result === 'correct'
      ? CorrectFeedbackIcon
      : result === 'incorrect' || !secondAttempt
      ? IncorrectFeedbackIcon
      : AlmostCorrectFeedbackIcon;

  const messageStyle =
    result === 'correct'
      ? styles.successMessage
      : result === 'incorrect' || !secondAttempt
      ? styles.failedMessage
      : styles.almostCorrectMessage;

  const message =
    result === 'correct'
      ? 'Great, keep it up! \nThe Word you filled in is correct.'
      : result === 'incorrect' || !secondAttempt
      ? `What a pity! Your entry is incorrect,\nthe correct answer is: ${
          document?.article?.toLowerCase() === ARTICLES.diePlural
            ? 'die'
            : document?.article
        } ${document?.word}`
      : `Your entry ${input} is almost correct. Check for upper and lower case.`;

  return result !== '' || secondAttempt ? (
    <View style={[styles.messageContainer, messageStyle]}>
      <Icon width={28} height={28} />
      <View style={styles.textContainer}>
        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.text}>
          {message}
        </Text>
      </View>
    </View>
  ) : null;
};

export default Feedback;
