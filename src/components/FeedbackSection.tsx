import React from 'react'
import {
  AlmostCorrectFeedbackIcon,
  correct_background,
  CorrectFeedbackIcon,
  hint_background,
  incorrect_background,
  IncorrectFeedbackIcon
} from '../../assets/images'
import { ARTICLES } from '../constants/data'
import { COLORS } from '../constants/colors'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { DocumentType } from '../constants/endpoints'
import styled from 'styled-components/native'

const Background = styled.ImageBackground`
  width: ${wp(80)};
  height: ${hp(9)};
  margin-bottom: 40px;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`

const StyledText = styled.Text`
  width: 100%;
  color: ${COLORS.lunesBlack};
  padding: 0 20px 0 10px;
`

export interface FeedbackPropsType {
  secondAttempt: boolean
  result: string
  document: DocumentType
  input: string
}

const Feedback = ({ result, document, input, secondAttempt }: FeedbackPropsType): JSX.Element | null => {
  let Icon, background, message
  if (result === 'correct') {
    Icon = CorrectFeedbackIcon
    background = correct_background
    message = 'Toll, weiter so! \nDeine Eingabe ist richtig.'
  } else if (result === 'incorrect' || result === 'giveUp' || !secondAttempt) {
    Icon = IncorrectFeedbackIcon
    background = incorrect_background
    message = `Die richtige Antwort ist: ${
      document.article.toLowerCase() === ARTICLES.diePlural ? 'die' : document.article
    } ${document.word}`
  } else {
    Icon = AlmostCorrectFeedbackIcon
    background = hint_background
    message = `Deine Eingabe ${input} ist fast richtig.`
  }

  return result !== '' || secondAttempt ? (
    <Background source={background} testID='background-image'>
      <Icon width={28} height={28} />
      <StyledText numberOfLines={2} ellipsizeMode='tail'>
        {message}
      </StyledText>
    </Background>
  ) : null
}

export default Feedback
