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
  margin-bottom: 40px;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
`

const StyledText = styled.Text`
  width: 100%;
  color: ${props => props.theme.colors.lunesBlack};
  padding: 0 20px 0 10px;
`

export interface FeedbackProps {
  documentWithResult: DocumentResult
  submission: string | null
  needsToBeRepeated: boolean
}

const Feedback = ({ documentWithResult, submission, needsToBeRepeated }: FeedbackProps): ReactElement | null => {
  const { result } = documentWithResult
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
      ? labels.exercises.write.feedback.wrong
      : `${labels.exercises.write.feedback.wrongWithSolution} „${documentWithResult.article.value} ${documentWithResult.word}“`
  }

  return (
    <Background source={background} testID='background-image'>
      <Icon width={28} height={28} />
      <StyledText numberOfLines={2} ellipsizeMode='tail' testID='feedback-write-exercise'>
        {message}
      </StyledText>
    </Background>
  )
}

export default Feedback
