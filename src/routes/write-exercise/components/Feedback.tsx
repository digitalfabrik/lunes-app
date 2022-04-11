/* eslint-disable camelcase */
import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import {
  CheckCloseCircleIconBold,
  BannerGreen,
  CheckCircleIconBold,
  BannerYellow,
  BannerRed,
  CloseCircleIconBold
} from '../../../../assets/images'
import labels from '../../../constants/labels.json'
import { DocumentResult } from '../../../navigation/NavigationTypes'

const Background = styled.ImageBackground`
  width: ${wp('80%')}px;
  height: ${hp('9%')}px;
  min-height: 50px;
  margin-bottom: ${props => props.theme.spacings.lg};
  flex-direction: row;
  align-items: center;
  padding: ${props => `0 ${props.theme.spacings.md} 0 ${props.theme.spacings.sm}`};
`

const StyledText = styled.Text`
  width: 100%;
  padding: ${props => `0 ${props.theme.spacings.md} 0 ${props.theme.spacings.sm}`};
  color: ${props => props.theme.colors.primary};
`

export interface FeedbackProps {
  documentWithResult: DocumentResult
  submission: string | null
  needsToBeRepeated: boolean
}

const Feedback = ({ documentWithResult, submission, needsToBeRepeated }: FeedbackProps): ReactElement | null => {
  const { result, document } = documentWithResult
  const correctSolution = `„${document.article.value} ${document.word}“`
  const wrongWithCorrectSolution = `${labels.exercises.write.feedback.wrongWithSolution} ${correctSolution}`

  let Icon
  let background
  let message

  if (result === 'correct') {
    Icon = CheckCircleIconBold
    background = BannerGreen
    message = labels.exercises.write.feedback.correct
  } else if (result === 'similar' && submission) {
    Icon = CheckCloseCircleIconBold
    background = BannerYellow
    message = `${labels.exercises.write.feedback.almostCorrect1} „${submission}“ ${labels.exercises.write.feedback.almostCorrect2}`
  } else {
    Icon = CloseCircleIconBold
    background = BannerRed
    message = needsToBeRepeated
      ? `${labels.exercises.write.feedback.wrong}\n${wrongWithCorrectSolution}`
      : wrongWithCorrectSolution
  }

  return (
    <Background source={background} testID='background-image'>
      <Icon width={28} height={28} />
      <StyledText numberOfLines={3} ellipsizeMode='tail' testID='feedback-write-exercise'>
        {message}
      </StyledText>
    </Background>
  )
}

export default Feedback
