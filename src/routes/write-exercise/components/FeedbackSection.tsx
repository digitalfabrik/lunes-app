import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import {
  AlmostCorrectFeedbackIcon,
  correct_background,
  CorrectFeedbackIcon,
  hint_background,
  incorrect_background,
  IncorrectFeedbackIcon
} from '../../../../assets/images'
import { SimpleResultType } from '../../../constants/data'
import { DocumentType } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'

const Background = styled.ImageBackground`
  width: ${wp(80)}px;
  height: ${hp(9)}px;
  margin-bottom: 40px;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`

const StyledText = styled.Text`
  width: 100%;
  color: ${props => props.theme.colors.lunesBlack};
  padding: 0 20px 0 10px;
`

export interface FeedbackPropsType {
  result: SimpleResultType
  document?: DocumentType
  submission: string | null
}

const Feedback = ({ result, document, submission }: FeedbackPropsType): ReactElement | null => {
  let Icon, background, message
  if (result === 'correct') {
    Icon = CorrectFeedbackIcon
    background = correct_background
    message = labels.exercises.write.feedback.correct
  } else if (result === 'incorrect' || submission === null) {
    Icon = IncorrectFeedbackIcon
    background = incorrect_background
    message = `${labels.exercises.write.feedback.wrong} „${document?.article.value ?? ''} ${document?.word ?? ''}“`
  } else {
    Icon = AlmostCorrectFeedbackIcon
    background = hint_background
    message = `${labels.exercises.write.feedback.almostCorrect1} „${submission}“ ${labels.exercises.write.feedback.almostCorrect2}`
  }

  return result !== null || submission !== null ? (
    <Background source={background} testID='background-image'>
      <Icon width={28} height={28} />
      <StyledText numberOfLines={2} ellipsizeMode='tail' testID={'feedback-write-exercise'}>
        {message}
      </StyledText>
    </Background>
  ) : null
}

export default Feedback
