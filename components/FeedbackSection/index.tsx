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
  ARTICLES,
} from './imports';

const Feedback = ({result, document, input, secondAttempt}: IFeedbackProps) => {
  const Icon =
    result === 'correct'
      ? CorrectIcon
      : result === 'incorrect' || !secondAttempt
      ? IncorrectIcon
      : AlmostCorrectIcon;

  const messageStyle =
    result === 'correct'
      ? styles.successMessage
      : result === 'incorrect'
      ? styles.failedMessage
      : styles.almostCorrectMessage;

  const message =
    result === 'correct'
      ? 'Great, keep it up! \nThe Word you filled in is correct.'
      : result === 'incorrect'
      ? `What a pity! Your entry is incorrect,\nthe correct answer is: ${
          document?.article?.toLowerCase() === ARTICLES.diePlural
            ? 'die'
            : document?.article
        } ${document?.word}`
      : `Your entry ${input} is almost correct. Check for upper and lower case.`;

  return result !== '' || secondAttempt ? (
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
