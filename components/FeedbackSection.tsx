import React from 'react';
import {View, Text, ImageBackground} from 'react-native';
import {IFeedbackProps} from '../interfaces/exercise';
import {
  CorrectFeedbackIcon,
  IncorrectFeedbackIcon,
  AlmostCorrectFeedbackIcon,
  incorrect_background,
  hint_background,
  correct_background,
} from '../assets/images';
import {ARTICLES} from '../constants/data';
import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  messageContainer: {
    width: wp('80%'),
    height: hp('9%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -hp('4%'),
    marginBottom: hp('3%'),
  },
  imageBackground: {
    width: wp('80%'),
    height: hp('9%'),
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textContainer: {
    marginHorizontal: 5,
    paddingRight: 15,
    paddingLeft: 5,
  },
  text: {
    fontSize: wp('3.5%'),
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
    color: COLORS.lunesBlack,
  },
});

const Feedback = ({result, document, input, secondAttempt}: IFeedbackProps) => {
  const Icon =
    result === 'correct'
      ? CorrectFeedbackIcon
      : result === 'incorrect' || !secondAttempt
      ? IncorrectFeedbackIcon
      : AlmostCorrectFeedbackIcon;

  const background =
    result === 'correct'
      ? correct_background
      : result === 'incorrect' || !secondAttempt
      ? incorrect_background
      : hint_background;

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
    <View style={styles.messageContainer}>
      <ImageBackground
        source={background}
        style={styles.imageBackground}
        testID="background-image">
        <Icon width={28} height={28} />
        <View style={styles.textContainer}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.text}>
            {message}
          </Text>
        </View>
      </ImageBackground>
    </View>
  ) : null;
};

export default Feedback;
