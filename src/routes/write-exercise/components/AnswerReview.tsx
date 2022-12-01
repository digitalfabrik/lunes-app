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
  CloseCircleIconBold,
} from '../../../../assets/images'
import { VocabularyItemResult } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'

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
  font-size: ${props => props.theme.fonts.smallFontSize};
`

export interface AnswerReviewProps {
  vocabularyItemWithResult: VocabularyItemResult
  submission: string | null
}

const AnswerReview = ({ vocabularyItemWithResult, submission }: AnswerReviewProps): ReactElement | null => {
  const { result, vocabularyItem } = vocabularyItemWithResult
  const correctSolution = `„${vocabularyItem.article.value} ${vocabularyItem.word}“`
  const correctSolutionHint = `${getLabels().exercises.write.feedback.solution} ${correctSolution}`

  let Icon
  let background
  let message

  if (result === 'correct') {
    Icon = CheckCircleIconBold
    background = BannerGreen
    message = getLabels().exercises.write.feedback.correct
  } else if (result === 'similar' && submission) {
    Icon = CheckCloseCircleIconBold
    background = BannerYellow
    message = `${getLabels().exercises.write.feedback.almostCorrect1} „${submission}“ ${
      getLabels().exercises.write.feedback.almostCorrect2
    }`
  } else {
    Icon = CloseCircleIconBold
    background = BannerRed
    message = submission ? `${getLabels().exercises.write.feedback.wrong}\n${correctSolutionHint}` : correctSolutionHint
  }

  return (
    <Background source={background} testID='background-image'>
      <Icon width={28} height={28} />
      <StyledText>{message}</StyledText>
    </Background>
  )
}

export default AnswerReview
