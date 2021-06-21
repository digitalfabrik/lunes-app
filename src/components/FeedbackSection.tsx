import React from 'react'
import { View, Text, ImageBackground, StyleSheet } from 'react-native'
import {
  CorrectFeedbackIcon,
  IncorrectFeedbackIcon,
  AlmostCorrectFeedbackIcon,
  incorrect_background,
  hint_background,
  correct_background
} from '../../assets/images'
import { ARTICLES } from '../constants/data'
import { COLORS } from '../constants/colors'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { DocumentType } from '../constants/endpoints'

export const styles = StyleSheet.create({
  messageContainer: {
    width: wp('80%'),
    height: hp('9%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -hp('4%'),
    marginBottom: hp('3%')
  },
  imageBackground: {
    width: wp('80%'),
    height: hp('9%'),
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  textContainer: {
    marginHorizontal: 5,
    paddingRight: 15,
    paddingLeft: 5
  },
  text: {
    fontSize: wp('3.5%'),
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
    color: COLORS.lunesBlack
  }
})

export interface FeedbackPropsType {
  secondAttempt: boolean
  result: string
  document?: DocumentType
  input: string
}

const Feedback = ({ result, document, input, secondAttempt }: FeedbackPropsType): JSX.Element | null => {
  const Icon =
    result === 'correct' || result === 'giveUp'
      ? CorrectFeedbackIcon
      : result === 'incorrect' || !secondAttempt
      ? IncorrectFeedbackIcon
      : AlmostCorrectFeedbackIcon

  const background =
    result === 'correct'
      ? correct_background
      : result === 'incorrect' || result === 'giveUp' || !secondAttempt
      ? incorrect_background
      : hint_background

  const message =
    result === 'correct'
      ? 'Toll, weiter so! \nDeine Eingabe ist richtig.'
      : result === 'incorrect' || !secondAttempt
      ? `${result === 'incorrect' ? `Schade, deine Eingabe ist falsch.` : ``} Die richtige Antwort ist: ${
          document?.article?.toLowerCase() === ARTICLES.diePlural ? 'die' : document?.article
        } ${document?.word}`
      : `Deine Eingabe ${input} ist fast richtig. Überprüfe Groß- und Kleinschreibung.`

  return result !== '' || secondAttempt ? (
    <View style={styles.messageContainer}>
      <ImageBackground source={background} style={styles.imageBackground} testID='background-image'>
        <Icon width={28} height={28} />
        <View style={styles.textContainer}>
          <Text numberOfLines={2} ellipsizeMode='tail' style={styles.text}>
            {message}
          </Text>
        </View>
      </ImageBackground>
    </View>
  ) : null
}

export default Feedback
